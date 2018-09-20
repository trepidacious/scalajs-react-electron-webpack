'use strict';
/* Scala.js runtime support
 * Copyright 2013 LAMP/EPFL
 * Author: Sébastien Doeraene
 */

/* ---------------------------------- *
 * The top-level Scala.js environment *
 * ---------------------------------- */





// Get the environment info
var $env = (typeof __ScalaJSEnv === "object" && __ScalaJSEnv) ? __ScalaJSEnv : {};

// Global scope
var $g =
  (typeof $env["global"] === "object" && $env["global"])
    ? $env["global"]
    : ((typeof global === "object" && global && global["Object"] === Object) ? global : this);
$env["global"] = $g;

// Where to send exports

var $e = exports;






$env["exportsNamespace"] = $e;

// Freeze the environment info
$g["Object"]["freeze"]($env);

// Linking info - must be in sync with scala.scalajs.runtime.LinkingInfo
var $linkingInfo = {
  "envInfo": $env,
  "semantics": {




    "asInstanceOfs": 1,








    "arrayIndexOutOfBounds": 1,










    "moduleInit": 2,





    "strictFloats": false,




    "productionMode": false

  },



  "assumingES6": false,

  "linkerVersion": "0.6.24",
  "globalThis": this
};
$g["Object"]["freeze"]($linkingInfo);
$g["Object"]["freeze"]($linkingInfo["semantics"]);

// Snapshots of builtins and polyfills






var $imul = $g["Math"]["imul"] || (function(a, b) {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
});

var $fround = $g["Math"]["fround"] ||









  (function(v) {
    return +v;
  });


var $clz32 = $g["Math"]["clz32"] || (function(i) {
  // See Hacker's Delight, Section 5-3
  if (i === 0) return 32;
  var r = 1;
  if ((i & 0xffff0000) === 0) { i <<= 16; r += 16; };
  if ((i & 0xff000000) === 0) { i <<= 8; r += 8; };
  if ((i & 0xf0000000) === 0) { i <<= 4; r += 4; };
  if ((i & 0xc0000000) === 0) { i <<= 2; r += 2; };
  return r + (i >> 31);
});


// Other fields




















var $lastIDHash = 0; // last value attributed to an id hash code



var $idHashCodeMap = $g["WeakMap"] ? new $g["WeakMap"]() : null;



// Core mechanism

var $makeIsArrayOfPrimitive = function(primitiveData) {
  return function(obj, depth) {
    return !!(obj && obj.$classData &&
      (obj.$classData.arrayDepth === depth) &&
      (obj.$classData.arrayBase === primitiveData));
  }
};


var $makeAsArrayOfPrimitive = function(isInstanceOfFunction, arrayEncodedName) {
  return function(obj, depth) {
    if (isInstanceOfFunction(obj, depth) || (obj === null))
      return obj;
    else
      $throwArrayCastException(obj, arrayEncodedName, depth);
  }
};


/** Encode a property name for runtime manipulation
  *  Usage:
  *    env.propertyName({someProp:0})
  *  Returns:
  *    "someProp"
  *  Useful when the property is renamed by a global optimizer (like Closure)
  *  but we must still get hold of a string of that name for runtime
  * reflection.
  */
var $propertyName = function(obj) {
  for (var prop in obj)
    return prop;
};

// Runtime functions

var $isScalaJSObject = function(obj) {
  return !!(obj && obj.$classData);
};


var $throwClassCastException = function(instance, classFullName) {




  throw new $c_sjsr_UndefinedBehaviorError().init___jl_Throwable(
    new $c_jl_ClassCastException().init___T(
      instance + " is not an instance of " + classFullName));

};

var $throwArrayCastException = function(instance, classArrayEncodedName, depth) {
  for (; depth; --depth)
    classArrayEncodedName = "[" + classArrayEncodedName;
  $throwClassCastException(instance, classArrayEncodedName);
};



var $throwArrayIndexOutOfBoundsException = function(i) {
  var msg = (i === null) ? null : ("" + i);



  throw new $c_sjsr_UndefinedBehaviorError().init___jl_Throwable(
    new $c_jl_ArrayIndexOutOfBoundsException().init___T(msg));

};


var $noIsInstance = function(instance) {
  throw new $g["TypeError"](
    "Cannot call isInstance() on a Class representing a raw JS trait/object");
};

var $makeNativeArrayWrapper = function(arrayClassData, nativeArray) {
  return new arrayClassData.constr(nativeArray);
};

var $newArrayObject = function(arrayClassData, lengths) {
  return $newArrayObjectInternal(arrayClassData, lengths, 0);
};

var $newArrayObjectInternal = function(arrayClassData, lengths, lengthIndex) {
  var result = new arrayClassData.constr(lengths[lengthIndex]);

  if (lengthIndex < lengths.length-1) {
    var subArrayClassData = arrayClassData.componentData;
    var subLengthIndex = lengthIndex+1;
    var underlying = result.u;
    for (var i = 0; i < underlying.length; i++) {
      underlying[i] = $newArrayObjectInternal(
        subArrayClassData, lengths, subLengthIndex);
    }
  }

  return result;
};

var $objectToString = function(instance) {
  if (instance === void 0)
    return "undefined";
  else
    return instance.toString();
};

var $objectGetClass = function(instance) {
  switch (typeof instance) {
    case "string":
      return $d_T.getClassOf();
    case "number": {
      var v = instance | 0;
      if (v === instance) { // is the value integral?
        if ($isByte(v))
          return $d_jl_Byte.getClassOf();
        else if ($isShort(v))
          return $d_jl_Short.getClassOf();
        else
          return $d_jl_Integer.getClassOf();
      } else {
        if ($isFloat(instance))
          return $d_jl_Float.getClassOf();
        else
          return $d_jl_Double.getClassOf();
      }
    }
    case "boolean":
      return $d_jl_Boolean.getClassOf();
    case "undefined":
      return $d_sr_BoxedUnit.getClassOf();
    default:
      if (instance === null)
        return instance.getClass__jl_Class();
      else if ($is_sjsr_RuntimeLong(instance))
        return $d_jl_Long.getClassOf();
      else if ($isScalaJSObject(instance))
        return instance.$classData.getClassOf();
      else
        return null; // Exception?
  }
};

var $objectClone = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.clone__O();
  else
    throw new $c_jl_CloneNotSupportedException().init___();
};

var $objectNotify = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notify__V();
};

var $objectNotifyAll = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notifyAll__V();
};

var $objectFinalize = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    instance.finalize__V();
  // else no-op
};

var $objectEquals = function(instance, rhs) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.equals__O__Z(rhs);
  else if (typeof instance === "number")
    return typeof rhs === "number" && $numberEquals(instance, rhs);
  else
    return instance === rhs;
};

var $numberEquals = function(lhs, rhs) {
  return (lhs === rhs) ? (
    // 0.0.equals(-0.0) must be false
    lhs !== 0 || 1/lhs === 1/rhs
  ) : (
    // are they both NaN?
    (lhs !== lhs) && (rhs !== rhs)
  );
};

var $objectHashCode = function(instance) {
  switch (typeof instance) {
    case "string":
      return $m_sjsr_RuntimeString$().hashCode__T__I(instance);
    case "number":
      return $m_sjsr_Bits$().numberHashCode__D__I(instance);
    case "boolean":
      return instance ? 1231 : 1237;
    case "undefined":
      return 0;
    default:
      if ($isScalaJSObject(instance) || instance === null)
        return instance.hashCode__I();

      else if ($idHashCodeMap === null)
        return 42;

      else
        return $systemIdentityHashCode(instance);
  }
};

var $comparableCompareTo = function(instance, rhs) {
  switch (typeof instance) {
    case "string":

      $as_T(rhs);

      return instance === rhs ? 0 : (instance < rhs ? -1 : 1);
    case "number":

      $as_jl_Number(rhs);

      return $m_jl_Double$().compare__D__D__I(instance, rhs);
    case "boolean":

      $asBoolean(rhs);

      return instance - rhs; // yes, this gives the right result
    default:
      return instance.compareTo__O__I(rhs);
  }
};

var $charSequenceLength = function(instance) {
  if (typeof(instance) === "string")

    return $uI(instance["length"]);



  else
    return instance.length__I();
};

var $charSequenceCharAt = function(instance, index) {
  if (typeof(instance) === "string")

    return $uI(instance["charCodeAt"](index)) & 0xffff;



  else
    return instance.charAt__I__C(index);
};

var $charSequenceSubSequence = function(instance, start, end) {
  if (typeof(instance) === "string")

    return $as_T(instance["substring"](start, end));



  else
    return instance.subSequence__I__I__jl_CharSequence(start, end);
};

var $booleanBooleanValue = function(instance) {
  if (typeof instance === "boolean") return instance;
  else                               return instance.booleanValue__Z();
};

var $numberByteValue = function(instance) {
  if (typeof instance === "number") return (instance << 24) >> 24;
  else                              return instance.byteValue__B();
};
var $numberShortValue = function(instance) {
  if (typeof instance === "number") return (instance << 16) >> 16;
  else                              return instance.shortValue__S();
};
var $numberIntValue = function(instance) {
  if (typeof instance === "number") return instance | 0;
  else                              return instance.intValue__I();
};
var $numberLongValue = function(instance) {
  if (typeof instance === "number")
    return $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong(instance);
  else
    return instance.longValue__J();
};
var $numberFloatValue = function(instance) {
  if (typeof instance === "number") return $fround(instance);
  else                              return instance.floatValue__F();
};
var $numberDoubleValue = function(instance) {
  if (typeof instance === "number") return instance;
  else                              return instance.doubleValue__D();
};

var $isNaN = function(instance) {
  return instance !== instance;
};

var $isInfinite = function(instance) {
  return !$g["isFinite"](instance) && !$isNaN(instance);
};

var $doubleToInt = function(x) {
  return (x > 2147483647) ? (2147483647) : ((x < -2147483648) ? -2147483648 : (x | 0));
};

/** Instantiates a JS object with variadic arguments to the constructor. */
var $newJSObjectWithVarargs = function(ctor, args) {
  // This basically emulates the ECMAScript specification for 'new'.
  var instance = $g["Object"]["create"](ctor.prototype);
  var result = ctor["apply"](instance, args);
  switch (typeof result) {
    case "string": case "number": case "boolean": case "undefined": case "symbol":
      return instance;
    default:
      return result === null ? instance : result;
  }
};

var $resolveSuperRef = function(initialProto, propName) {
  var getPrototypeOf = $g["Object"]["getPrototypeOf"];
  var getOwnPropertyDescriptor = $g["Object"]["getOwnPropertyDescriptor"];

  var superProto = getPrototypeOf(initialProto);
  while (superProto !== null) {
    var desc = getOwnPropertyDescriptor(superProto, propName);
    if (desc !== void 0)
      return desc;
    superProto = getPrototypeOf(superProto);
  }

  return void 0;
};

var $superGet = function(initialProto, self, propName) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var getter = desc["get"];
    if (getter !== void 0)
      return getter["call"](self);
    else
      return desc["value"];
  }
  return void 0;
};

var $superSet = function(initialProto, self, propName, value) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var setter = desc["set"];
    if (setter !== void 0) {
      setter["call"](self, value);
      return void 0;
    }
  }
  throw new $g["TypeError"]("super has no setter '" + propName + "'.");
};


var $moduleDefault = function(m) {
  return (m && (typeof m === "object") && "default" in m) ? m["default"] : m;
};


var $propertiesOf = function(obj) {
  var result = [];
  for (var prop in obj)
    result["push"](prop);
  return result;
};

var $systemArraycopy = function(src, srcPos, dest, destPos, length) {
  var srcu = src.u;
  var destu = dest.u;


  if (srcPos < 0 || destPos < 0 || length < 0 ||
      (srcPos > ((srcu.length - length) | 0)) ||
      (destPos > ((destu.length - length) | 0))) {
    $throwArrayIndexOutOfBoundsException(null);
  }


  if (srcu !== destu || destPos < srcPos || (((srcPos + length) | 0) < destPos)) {
    for (var i = 0; i < length; i = (i + 1) | 0)
      destu[(destPos + i) | 0] = srcu[(srcPos + i) | 0];
  } else {
    for (var i = (length - 1) | 0; i >= 0; i = (i - 1) | 0)
      destu[(destPos + i) | 0] = srcu[(srcPos + i) | 0];
  }
};

var $systemIdentityHashCode =

  ($idHashCodeMap !== null) ?

  (function(obj) {
    switch (typeof obj) {
      case "string": case "number": case "boolean": case "undefined":
        return $objectHashCode(obj);
      default:
        if (obj === null) {
          return 0;
        } else {
          var hash = $idHashCodeMap["get"](obj);
          if (hash === void 0) {
            hash = ($lastIDHash + 1) | 0;
            $lastIDHash = hash;
            $idHashCodeMap["set"](obj, hash);
          }
          return hash;
        }
    }

  }) :
  (function(obj) {
    if ($isScalaJSObject(obj)) {
      var hash = obj["$idHashCode$0"];
      if (hash !== void 0) {
        return hash;
      } else if (!$g["Object"]["isSealed"](obj)) {
        hash = ($lastIDHash + 1) | 0;
        $lastIDHash = hash;
        obj["$idHashCode$0"] = hash;
        return hash;
      } else {
        return 42;
      }
    } else if (obj === null) {
      return 0;
    } else {
      return $objectHashCode(obj);
    }

  });

// is/as for hijacked boxed classes (the non-trivial ones)

var $isByte = function(v) {
  return typeof v === "number" && (v << 24 >> 24) === v && 1/v !== 1/-0;
};

var $isShort = function(v) {
  return typeof v === "number" && (v << 16 >> 16) === v && 1/v !== 1/-0;
};

var $isInt = function(v) {
  return typeof v === "number" && (v | 0) === v && 1/v !== 1/-0;
};

var $isFloat = function(v) {



  return typeof v === "number";

};


var $asUnit = function(v) {
  if (v === void 0 || v === null)
    return v;
  else
    $throwClassCastException(v, "scala.runtime.BoxedUnit");
};

var $asBoolean = function(v) {
  if (typeof v === "boolean" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Boolean");
};

var $asByte = function(v) {
  if ($isByte(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Byte");
};

var $asShort = function(v) {
  if ($isShort(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Short");
};

var $asInt = function(v) {
  if ($isInt(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Integer");
};

var $asFloat = function(v) {
  if ($isFloat(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Float");
};

var $asDouble = function(v) {
  if (typeof v === "number" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Double");
};


// Unboxes


var $uZ = function(value) {
  return !!$asBoolean(value);
};
var $uB = function(value) {
  return $asByte(value) | 0;
};
var $uS = function(value) {
  return $asShort(value) | 0;
};
var $uI = function(value) {
  return $asInt(value) | 0;
};
var $uJ = function(value) {
  return null === value ? $m_sjsr_RuntimeLong$().Zero$1
                        : $as_sjsr_RuntimeLong(value);
};
var $uF = function(value) {
  /* Here, it is fine to use + instead of fround, because asFloat already
   * ensures that the result is either null or a float.
   */
  return +$asFloat(value);
};
var $uD = function(value) {
  return +$asDouble(value);
};






// TypeArray conversions

var $byteArray2TypedArray = function(value) { return new $g["Int8Array"](value.u); };
var $shortArray2TypedArray = function(value) { return new $g["Int16Array"](value.u); };
var $charArray2TypedArray = function(value) { return new $g["Uint16Array"](value.u); };
var $intArray2TypedArray = function(value) { return new $g["Int32Array"](value.u); };
var $floatArray2TypedArray = function(value) { return new $g["Float32Array"](value.u); };
var $doubleArray2TypedArray = function(value) { return new $g["Float64Array"](value.u); };

var $typedArray2ByteArray = function(value) {
  var arrayClassData = $d_B.getArrayOf();
  return new arrayClassData.constr(new $g["Int8Array"](value));
};
var $typedArray2ShortArray = function(value) {
  var arrayClassData = $d_S.getArrayOf();
  return new arrayClassData.constr(new $g["Int16Array"](value));
};
var $typedArray2CharArray = function(value) {
  var arrayClassData = $d_C.getArrayOf();
  return new arrayClassData.constr(new $g["Uint16Array"](value));
};
var $typedArray2IntArray = function(value) {
  var arrayClassData = $d_I.getArrayOf();
  return new arrayClassData.constr(new $g["Int32Array"](value));
};
var $typedArray2FloatArray = function(value) {
  var arrayClassData = $d_F.getArrayOf();
  return new arrayClassData.constr(new $g["Float32Array"](value));
};
var $typedArray2DoubleArray = function(value) {
  var arrayClassData = $d_D.getArrayOf();
  return new arrayClassData.constr(new $g["Float64Array"](value));
};

// TypeData class


/** @constructor */
var $TypeData = function() {




  // Runtime support
  this.constr = void 0;
  this.parentData = void 0;
  this.ancestors = null;
  this.componentData = null;
  this.arrayBase = null;
  this.arrayDepth = 0;
  this.zero = null;
  this.arrayEncodedName = "";
  this._classOf = void 0;
  this._arrayOf = void 0;
  this.isArrayOf = void 0;

  // java.lang.Class support
  this["name"] = "";
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = false;
  this["isRawJSType"] = false;
  this["isInstance"] = void 0;
};


$TypeData.prototype.initPrim = function(



    zero, arrayEncodedName, displayName) {
  // Runtime support
  this.ancestors = {};
  this.componentData = null;
  this.zero = zero;
  this.arrayEncodedName = arrayEncodedName;
  this.isArrayOf = function(obj, depth) { return false; };

  // java.lang.Class support
  this["name"] = displayName;
  this["isPrimitive"] = true;
  this["isInstance"] = function(obj) { return false; };

  return this;
};


$TypeData.prototype.initClass = function(



    internalNameObj, isInterface, fullName,
    ancestors, isRawJSType, parentData, isInstance, isArrayOf) {
  var internalName = $propertyName(internalNameObj);

  isInstance = isInstance || function(obj) {
    return !!(obj && obj.$classData && obj.$classData.ancestors[internalName]);
  };

  isArrayOf = isArrayOf || function(obj, depth) {
    return !!(obj && obj.$classData && (obj.$classData.arrayDepth === depth)
      && obj.$classData.arrayBase.ancestors[internalName])
  };

  // Runtime support
  this.parentData = parentData;
  this.ancestors = ancestors;
  this.arrayEncodedName = "L"+fullName+";";
  this.isArrayOf = isArrayOf;

  // java.lang.Class support
  this["name"] = fullName;
  this["isInterface"] = isInterface;
  this["isRawJSType"] = !!isRawJSType;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.initArray = function(



    componentData) {
  // The constructor

  var componentZero0 = componentData.zero;

  // The zero for the Long runtime representation
  // is a special case here, since the class has not
  // been defined yet, when this file is read
  var componentZero = (componentZero0 == "longZero")
    ? $m_sjsr_RuntimeLong$().Zero$1
    : componentZero0;


  /** @constructor */
  var ArrayClass = function(arg) {
    if (typeof(arg) === "number") {
      // arg is the length of the array
      this.u = new Array(arg);
      for (var i = 0; i < arg; i++)
        this.u[i] = componentZero;
    } else {
      // arg is a native array that we wrap
      this.u = arg;
    }
  }
  ArrayClass.prototype = new $h_O;
  ArrayClass.prototype.constructor = ArrayClass;


  ArrayClass.prototype.get = function(i) {
    if (i < 0 || i >= this.u.length)
      $throwArrayIndexOutOfBoundsException(i);
    return this.u[i];
  };
  ArrayClass.prototype.set = function(i, v) {
    if (i < 0 || i >= this.u.length)
      $throwArrayIndexOutOfBoundsException(i);
    this.u[i] = v;
  };


  ArrayClass.prototype.clone__O = function() {
    if (this.u instanceof Array)
      return new ArrayClass(this.u["slice"](0));
    else
      // The underlying Array is a TypedArray
      return new ArrayClass(new this.u.constructor(this.u));
  };






































  ArrayClass.prototype.$classData = this;

  // Don't generate reflective call proxies. The compiler special cases
  // reflective calls to methods on scala.Array

  // The data

  var encodedName = "[" + componentData.arrayEncodedName;
  var componentBase = componentData.arrayBase || componentData;
  var arrayDepth = componentData.arrayDepth + 1;

  var isInstance = function(obj) {
    return componentBase.isArrayOf(obj, arrayDepth);
  }

  // Runtime support
  this.constr = ArrayClass;
  this.parentData = $d_O;
  this.ancestors = {O: 1, jl_Cloneable: 1, Ljava_io_Serializable: 1};
  this.componentData = componentData;
  this.arrayBase = componentBase;
  this.arrayDepth = arrayDepth;
  this.zero = null;
  this.arrayEncodedName = encodedName;
  this._classOf = undefined;
  this._arrayOf = undefined;
  this.isArrayOf = undefined;

  // java.lang.Class support
  this["name"] = encodedName;
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = true;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.getClassOf = function() {



  if (!this._classOf)
    this._classOf = new $c_jl_Class().init___jl_ScalaJSClassData(this);
  return this._classOf;
};


$TypeData.prototype.getArrayOf = function() {



  if (!this._arrayOf)
    this._arrayOf = new $TypeData().initArray(this);
  return this._arrayOf;
};

// java.lang.Class support


$TypeData.prototype["getFakeInstance"] = function() {



  if (this === $d_T)
    return "some string";
  else if (this === $d_jl_Boolean)
    return false;
  else if (this === $d_jl_Byte ||
           this === $d_jl_Short ||
           this === $d_jl_Integer ||
           this === $d_jl_Float ||
           this === $d_jl_Double)
    return 0;
  else if (this === $d_jl_Long)
    return $m_sjsr_RuntimeLong$().Zero$1;
  else if (this === $d_sr_BoxedUnit)
    return void 0;
  else
    return {$classData: this};
};


$TypeData.prototype["getSuperclass"] = function() {



  return this.parentData ? this.parentData.getClassOf() : null;
};


$TypeData.prototype["getComponentType"] = function() {



  return this.componentData ? this.componentData.getClassOf() : null;
};


$TypeData.prototype["newArrayOfThisClass"] = function(lengths) {



  var arrayClassData = this;
  for (var i = 0; i < lengths.length; i++)
    arrayClassData = arrayClassData.getArrayOf();
  return $newArrayObject(arrayClassData, lengths);
};




// Create primitive types

var $d_V = new $TypeData().initPrim(undefined, "V", "void");
var $d_Z = new $TypeData().initPrim(false, "Z", "boolean");
var $d_C = new $TypeData().initPrim(0, "C", "char");
var $d_B = new $TypeData().initPrim(0, "B", "byte");
var $d_S = new $TypeData().initPrim(0, "S", "short");
var $d_I = new $TypeData().initPrim(0, "I", "int");
var $d_J = new $TypeData().initPrim("longZero", "J", "long");
var $d_F = new $TypeData().initPrim(0.0, "F", "float");
var $d_D = new $TypeData().initPrim(0.0, "D", "double");

// Instance tests for array of primitives

var $isArrayOf_Z = $makeIsArrayOfPrimitive($d_Z);
$d_Z.isArrayOf = $isArrayOf_Z;

var $isArrayOf_C = $makeIsArrayOfPrimitive($d_C);
$d_C.isArrayOf = $isArrayOf_C;

var $isArrayOf_B = $makeIsArrayOfPrimitive($d_B);
$d_B.isArrayOf = $isArrayOf_B;

var $isArrayOf_S = $makeIsArrayOfPrimitive($d_S);
$d_S.isArrayOf = $isArrayOf_S;

var $isArrayOf_I = $makeIsArrayOfPrimitive($d_I);
$d_I.isArrayOf = $isArrayOf_I;

var $isArrayOf_J = $makeIsArrayOfPrimitive($d_J);
$d_J.isArrayOf = $isArrayOf_J;

var $isArrayOf_F = $makeIsArrayOfPrimitive($d_F);
$d_F.isArrayOf = $isArrayOf_F;

var $isArrayOf_D = $makeIsArrayOfPrimitive($d_D);
$d_D.isArrayOf = $isArrayOf_D;


// asInstanceOfs for array of primitives
var $asArrayOf_Z = $makeAsArrayOfPrimitive($isArrayOf_Z, "Z");
var $asArrayOf_C = $makeAsArrayOfPrimitive($isArrayOf_C, "C");
var $asArrayOf_B = $makeAsArrayOfPrimitive($isArrayOf_B, "B");
var $asArrayOf_S = $makeAsArrayOfPrimitive($isArrayOf_S, "S");
var $asArrayOf_I = $makeAsArrayOfPrimitive($isArrayOf_I, "I");
var $asArrayOf_J = $makeAsArrayOfPrimitive($isArrayOf_J, "J");
var $asArrayOf_F = $makeAsArrayOfPrimitive($isArrayOf_F, "F");
var $asArrayOf_D = $makeAsArrayOfPrimitive($isArrayOf_D, "D");

var $i_react = require("react");
var $i_downshift = require("downshift");
var $i_$0040material$002dui$002fcore$002fCard = require("@material-ui/core/Card");
var $i_$0040material$002dui$002fcore$002fChip = require("@material-ui/core/Chip");
var $i_$0040material$002dui$002fcore$002fMenuItem = require("@material-ui/core/MenuItem");
var $i_$0040material$002dui$002fcore$002fstyles = require("@material-ui/core/styles");
var $i_$0040material$002dui$002fcore$002fPaper = require("@material-ui/core/Paper");
var $i_$0040material$002dui$002fcore$002fTextField = require("@material-ui/core/TextField");
var $i_react$002ddom = require("react-dom");
function $f_F1__compose__F1__F1($thiz, g) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, g$1) {
    return (function(x$2) {
      return $this.apply__O__O(g$1.apply__O__O(x$2))
    })
  })($thiz, g))
}
function $is_F1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.F1)))
}
function $as_F1(obj) {
  return (($is_F1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Function1"))
}
function $isArrayOf_F1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.F1)))
}
function $asArrayOf_F1(obj, depth) {
  return (($isArrayOf_F1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Function1;", depth))
}
function $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot($thiz) {
  return $as_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot($thiz.raw__Ljapgolly_scalajs_react_raw_React$Component().mountedImpure)
}
function $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__backend__O($thiz) {
  return $thiz.raw__Ljapgolly_scalajs_react_raw_React$Component().backend
}
function $is_Ljapgolly_scalajs_react_vdom_Builder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_Builder)))
}
function $as_Ljapgolly_scalajs_react_vdom_Builder(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_Builder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.Builder"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_Builder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_Builder)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_Builder(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_Builder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.Builder;", depth))
}
function $f_Ljapgolly_scalajs_react_vdom_HtmlAttrs__$$init$__V($thiz) {
  $thiz.key$1 = $m_Ljapgolly_scalajs_react_vdom_Attr$Key$();
  $thiz.onChange$1 = new $c_Ljapgolly_scalajs_react_vdom_Attr$Event().init___T("onChange");
  $thiz.onClick$1 = new $c_Ljapgolly_scalajs_react_vdom_Attr$Event().init___T("onClick");
  $thiz.onClickCapture$1 = new $c_Ljapgolly_scalajs_react_vdom_Attr$Event().init___T("onClickCapture");
  $thiz.src$1 = ($m_Ljapgolly_scalajs_react_vdom_PackageBase$(), new $c_Ljapgolly_scalajs_react_vdom_Attr$Generic().init___T("src"));
  $thiz.title$1 = ($m_Ljapgolly_scalajs_react_vdom_PackageBase$(), new $c_Ljapgolly_scalajs_react_vdom_Attr$Generic().init___T("title"));
  $thiz.type$1 = ($m_Ljapgolly_scalajs_react_vdom_PackageBase$(), new $c_Ljapgolly_scalajs_react_vdom_Attr$Generic().init___T("type"));
  $thiz.value$1 = ($m_Ljapgolly_scalajs_react_vdom_PackageBase$(), new $c_Ljapgolly_scalajs_react_vdom_Attr$Generic().init___T("value"))
}
function $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1__vdomAttrVtKey__F1__F2($thiz, k) {
  $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$();
  var fn = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, k$1) {
    return (function(b$2, a$2) {
      var b = $as_F1(b$2);
      b.apply__O__O(k$1.apply__O__O(a$2))
    })
  })($thiz, k));
  return fn
}
function $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1__$$init$__V($thiz) {
  $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$();
  var fn = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(b$2, a$2) {
      var b = $as_F1(b$2);
      var t = $uJ(a$2);
      var lo = t.lo$2;
      var hi = t.hi$2;
      var s = $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toString__I__I__T(lo, hi);
      b.apply__O__O(s)
    })
  })($thiz));
  $thiz.vdomAttrVtKeyL$2 = fn;
  var k = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
    return (function(a$3$2) {
      var a$3 = $as_T(a$3$2);
      return a$3
    })
  })($thiz));
  $thiz.vdomAttrVtKeyS$2 = $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1__vdomAttrVtKey__F1__F2($thiz, k)
}
function $f_Ljapgolly_scalajs_react_vdom_TagMod__when__Z__Ljapgolly_scalajs_react_vdom_TagMod($thiz, condition) {
  return (condition ? $thiz : $m_Ljapgolly_scalajs_react_vdom_TagMod$().empty$1)
}
function $is_Ljapgolly_scalajs_react_vdom_TagMod(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_TagMod)))
}
function $as_Ljapgolly_scalajs_react_vdom_TagMod(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_TagMod(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.TagMod"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_TagMod)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.TagMod;", depth))
}
function $is_Lorg_rebeam_mui_Chip$Color(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_mui_Chip$Color)))
}
function $as_Lorg_rebeam_mui_Chip$Color(obj) {
  return (($is_Lorg_rebeam_mui_Chip$Color(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.mui.Chip$Color"))
}
function $isArrayOf_Lorg_rebeam_mui_Chip$Color(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_mui_Chip$Color)))
}
function $asArrayOf_Lorg_rebeam_mui_Chip$Color(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_mui_Chip$Color(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.mui.Chip$Color;", depth))
}
function $is_Lorg_rebeam_mui_TextField$Margin(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_mui_TextField$Margin)))
}
function $as_Lorg_rebeam_mui_TextField$Margin(obj) {
  return (($is_Lorg_rebeam_mui_TextField$Margin(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.mui.TextField$Margin"))
}
function $isArrayOf_Lorg_rebeam_mui_TextField$Margin(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_mui_TextField$Margin)))
}
function $asArrayOf_Lorg_rebeam_mui_TextField$Margin(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_mui_TextField$Margin(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.mui.TextField$Margin;", depth))
}
/** @constructor */
function $c_O() {
  /*<skip>*/
}
/** @constructor */
function $h_O() {
  /*<skip>*/
}
$h_O.prototype = $c_O.prototype;
$c_O.prototype.init___ = (function() {
  return this
});
$c_O.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_O.prototype.toString__T = (function() {
  var jsx$2 = $objectGetClass(this).getName__T();
  var i = this.hashCode__I();
  var x = $uD((i >>> 0));
  var jsx$1 = x.toString(16);
  return ((jsx$2 + "@") + $as_T(jsx$1))
});
$c_O.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
$c_O.prototype.toString = (function() {
  return this.toString__T()
});
function $is_O(obj) {
  return (obj !== null)
}
function $as_O(obj) {
  return obj
}
function $isArrayOf_O(obj, depth) {
  var data = (obj && obj.$classData);
  if ((!data)) {
    return false
  } else {
    var arrayDepth = (data.arrayDepth || 0);
    return ((!(arrayDepth < depth)) && ((arrayDepth > depth) || (!data.arrayBase.isPrimitive)))
  }
}
function $asArrayOf_O(obj, depth) {
  return (($isArrayOf_O(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Object;", depth))
}
var $d_O = new $TypeData().initClass({
  O: 0
}, false, "java.lang.Object", {
  O: 1
}, (void 0), (void 0), $is_O, $isArrayOf_O);
$c_O.prototype.$classData = $d_O;
function $is_ju_Formattable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.ju_Formattable)))
}
function $as_ju_Formattable(obj) {
  return (($is_ju_Formattable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.util.Formattable"))
}
function $isArrayOf_ju_Formattable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.ju_Formattable)))
}
function $asArrayOf_ju_Formattable(obj, depth) {
  return (($isArrayOf_ju_Formattable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.util.Formattable;", depth))
}
function $f_s_Proxy__equals__O__Z($thiz, that) {
  return ((that !== null) && (((that === $thiz) || (that === $thiz.self$1)) || $objectEquals(that, $thiz.self$1)))
}
function $f_s_Proxy__toString__T($thiz) {
  return ("" + $thiz.self$1)
}
function $f_s_util_control_NoStackTrace__fillInStackTrace__jl_Throwable($thiz) {
  var this$1 = $m_s_util_control_NoStackTrace$();
  if (this$1.$$undnoSuppression$1) {
    return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call($thiz)
  } else {
    return $as_jl_Throwable($thiz)
  }
}
function $is_sc_GenTraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversableOnce)))
}
function $as_sc_GenTraversableOnce(obj) {
  return (($is_sc_GenTraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversableOnce"))
}
function $isArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversableOnce)))
}
function $asArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (($isArrayOf_sc_GenTraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversableOnce;", depth))
}
function $f_sci_VectorPointer__copyOf__AO__AO($thiz, a) {
  var copy = $newArrayObject($d_O.getArrayOf(), [a.u.length]);
  $systemArraycopy(a, 0, copy, 0, a.u.length);
  return copy
}
function $f_sci_VectorPointer__gotoNextBlockStart__I__I__V($thiz, index, xor) {
  if ((xor < 1024)) {
    $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
  } else if ((xor < 32768)) {
    $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1));
    $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get(0), 1))
  } else if ((xor < 1048576)) {
    $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get((31 & ((index >>> 15) | 0))), 1));
    $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get(0), 1));
    $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get(0), 1))
  } else if ((xor < 33554432)) {
    $thiz.display3$und$eq__AO__V($asArrayOf_O($thiz.display4__AO().get((31 & ((index >>> 20) | 0))), 1));
    $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get(0), 1));
    $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get(0), 1));
    $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get(0), 1))
  } else if ((xor < 1073741824)) {
    $thiz.display4$und$eq__AO__V($asArrayOf_O($thiz.display5__AO().get((31 & ((index >>> 25) | 0))), 1));
    $thiz.display3$und$eq__AO__V($asArrayOf_O($thiz.display4__AO().get(0), 1));
    $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get(0), 1));
    $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get(0), 1));
    $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get(0), 1))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $f_sci_VectorPointer__getElem__I__I__O($thiz, index, xor) {
  if ((xor < 32)) {
    return $thiz.display0__AO().get((31 & index))
  } else if ((xor < 1024)) {
    return $asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1).get((31 & index))
  } else if ((xor < 32768)) {
    return $asArrayOf_O($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1).get((31 & ((index >>> 5) | 0))), 1).get((31 & index))
  } else if ((xor < 1048576)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($thiz.display3__AO().get((31 & ((index >>> 15) | 0))), 1).get((31 & ((index >>> 10) | 0))), 1).get((31 & ((index >>> 5) | 0))), 1).get((31 & index))
  } else if ((xor < 33554432)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($thiz.display4__AO().get((31 & ((index >>> 20) | 0))), 1).get((31 & ((index >>> 15) | 0))), 1).get((31 & ((index >>> 10) | 0))), 1).get((31 & ((index >>> 5) | 0))), 1).get((31 & index))
  } else if ((xor < 1073741824)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($thiz.display5__AO().get((31 & ((index >>> 25) | 0))), 1).get((31 & ((index >>> 20) | 0))), 1).get((31 & ((index >>> 15) | 0))), 1).get((31 & ((index >>> 10) | 0))), 1).get((31 & ((index >>> 5) | 0))), 1).get((31 & index))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $f_sci_VectorPointer__gotoPos__I__I__V($thiz, index, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
    } else if ((xor < 32768)) {
      $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1));
      $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
    } else if ((xor < 1048576)) {
      $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get((31 & ((index >>> 15) | 0))), 1));
      $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1));
      $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
    } else if ((xor < 33554432)) {
      $thiz.display3$und$eq__AO__V($asArrayOf_O($thiz.display4__AO().get((31 & ((index >>> 20) | 0))), 1));
      $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get((31 & ((index >>> 15) | 0))), 1));
      $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1));
      $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
    } else if ((xor < 1073741824)) {
      $thiz.display4$und$eq__AO__V($asArrayOf_O($thiz.display5__AO().get((31 & ((index >>> 25) | 0))), 1));
      $thiz.display3$und$eq__AO__V($asArrayOf_O($thiz.display4__AO().get((31 & ((index >>> 20) | 0))), 1));
      $thiz.display2$und$eq__AO__V($asArrayOf_O($thiz.display3__AO().get((31 & ((index >>> 15) | 0))), 1));
      $thiz.display1$und$eq__AO__V($asArrayOf_O($thiz.display2__AO().get((31 & ((index >>> 10) | 0))), 1));
      $thiz.display0$und$eq__AO__V($asArrayOf_O($thiz.display1__AO().get((31 & ((index >>> 5) | 0))), 1))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
function $f_sci_VectorPointer__stabilize__I__V($thiz, index) {
  var x1 = (((-1) + $thiz.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $thiz.display5__AO();
      $thiz.display5$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a));
      var a$1 = $thiz.display4__AO();
      $thiz.display4$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$1));
      var a$2 = $thiz.display3__AO();
      $thiz.display3$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$2));
      var a$3 = $thiz.display2__AO();
      $thiz.display2$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$3));
      var a$4 = $thiz.display1__AO();
      $thiz.display1$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$4));
      $thiz.display5__AO().set((31 & ((index >>> 25) | 0)), $thiz.display4__AO());
      $thiz.display4__AO().set((31 & ((index >>> 20) | 0)), $thiz.display3__AO());
      $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO());
      $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
      $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
      break
    }
    case 4: {
      var a$5 = $thiz.display4__AO();
      $thiz.display4$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$5));
      var a$6 = $thiz.display3__AO();
      $thiz.display3$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$6));
      var a$7 = $thiz.display2__AO();
      $thiz.display2$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$7));
      var a$8 = $thiz.display1__AO();
      $thiz.display1$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$8));
      $thiz.display4__AO().set((31 & ((index >>> 20) | 0)), $thiz.display3__AO());
      $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO());
      $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
      $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
      break
    }
    case 3: {
      var a$9 = $thiz.display3__AO();
      $thiz.display3$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$9));
      var a$10 = $thiz.display2__AO();
      $thiz.display2$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$10));
      var a$11 = $thiz.display1__AO();
      $thiz.display1$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$11));
      $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO());
      $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
      $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
      break
    }
    case 2: {
      var a$12 = $thiz.display2__AO();
      $thiz.display2$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$12));
      var a$13 = $thiz.display1__AO();
      $thiz.display1$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$13));
      $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
      $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
      break
    }
    case 1: {
      var a$14 = $thiz.display1__AO();
      $thiz.display1$und$eq__AO__V($f_sci_VectorPointer__copyOf__AO__AO($thiz, a$14));
      $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
      break
    }
    case 0: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $f_sci_VectorPointer__gotoNextBlockStartWritable__I__I__V($thiz, index, xor) {
  if ((xor < 1024)) {
    if (($thiz.depth__I() === 1)) {
      $thiz.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $thiz.display1__AO().set(0, $thiz.display0__AO());
      $thiz.depth$und$eq__I__V(((1 + $thiz.depth__I()) | 0))
    };
    $thiz.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO())
  } else if ((xor < 32768)) {
    if (($thiz.depth__I() === 2)) {
      $thiz.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $thiz.display2__AO().set(0, $thiz.display1__AO());
      $thiz.depth$und$eq__I__V(((1 + $thiz.depth__I()) | 0))
    };
    $thiz.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
    $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO())
  } else if ((xor < 1048576)) {
    if (($thiz.depth__I() === 3)) {
      $thiz.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $thiz.display3__AO().set(0, $thiz.display2__AO());
      $thiz.depth$und$eq__I__V(((1 + $thiz.depth__I()) | 0))
    };
    $thiz.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
    $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
    $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO())
  } else if ((xor < 33554432)) {
    if (($thiz.depth__I() === 4)) {
      $thiz.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $thiz.display4__AO().set(0, $thiz.display3__AO());
      $thiz.depth$und$eq__I__V(((1 + $thiz.depth__I()) | 0))
    };
    $thiz.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
    $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
    $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO());
    $thiz.display4__AO().set((31 & ((index >>> 20) | 0)), $thiz.display3__AO())
  } else if ((xor < 1073741824)) {
    if (($thiz.depth__I() === 5)) {
      $thiz.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $thiz.display5__AO().set(0, $thiz.display4__AO());
      $thiz.depth$und$eq__I__V(((1 + $thiz.depth__I()) | 0))
    };
    $thiz.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $thiz.display1__AO().set((31 & ((index >>> 5) | 0)), $thiz.display0__AO());
    $thiz.display2__AO().set((31 & ((index >>> 10) | 0)), $thiz.display1__AO());
    $thiz.display3__AO().set((31 & ((index >>> 15) | 0)), $thiz.display2__AO());
    $thiz.display4__AO().set((31 & ((index >>> 20) | 0)), $thiz.display3__AO());
    $thiz.display5__AO().set((31 & ((index >>> 25) | 0)), $thiz.display4__AO())
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $f_sci_VectorPointer__initFrom__sci_VectorPointer__I__V($thiz, that, depth) {
  $thiz.depth$und$eq__I__V(depth);
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case (-1): {
      break
    }
    case 0: {
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 1: {
      $thiz.display1$und$eq__AO__V(that.display1__AO());
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 2: {
      $thiz.display2$und$eq__AO__V(that.display2__AO());
      $thiz.display1$und$eq__AO__V(that.display1__AO());
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 3: {
      $thiz.display3$und$eq__AO__V(that.display3__AO());
      $thiz.display2$und$eq__AO__V(that.display2__AO());
      $thiz.display1$und$eq__AO__V(that.display1__AO());
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 4: {
      $thiz.display4$und$eq__AO__V(that.display4__AO());
      $thiz.display3$und$eq__AO__V(that.display3__AO());
      $thiz.display2$und$eq__AO__V(that.display2__AO());
      $thiz.display1$und$eq__AO__V(that.display1__AO());
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 5: {
      $thiz.display5$und$eq__AO__V(that.display5__AO());
      $thiz.display4$und$eq__AO__V(that.display4__AO());
      $thiz.display3$und$eq__AO__V(that.display3__AO());
      $thiz.display2$und$eq__AO__V(that.display2__AO());
      $thiz.display1$und$eq__AO__V(that.display1__AO());
      $thiz.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_Callback$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_Ljapgolly_scalajs_react_Callback$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_Callback$.prototype.constructor = $c_Ljapgolly_scalajs_react_Callback$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_Callback$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_Callback$.prototype = $c_Ljapgolly_scalajs_react_Callback$.prototype;
$c_Ljapgolly_scalajs_react_Callback$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_Callback$ = this;
  this.empty$1 = $m_Ljapgolly_scalajs_react_CallbackTo$().pure__O__F0((void 0));
  return this
});
$c_Ljapgolly_scalajs_react_Callback$.prototype.apply__F0__Ljapgolly_scalajs_react_Callback$ResultGuard__F0 = (function(f, evidence$2) {
  var f$2 = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1) {
    return (function() {
      f$1.apply__O()
    })
  })(this, f));
  return f$2
});
var $d_Ljapgolly_scalajs_react_Callback$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_Callback$: 0
}, false, "japgolly.scalajs.react.Callback$", {
  Ljapgolly_scalajs_react_Callback$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_Callback$.prototype.$classData = $d_Ljapgolly_scalajs_react_Callback$;
var $n_Ljapgolly_scalajs_react_Callback$ = (void 0);
function $m_Ljapgolly_scalajs_react_Callback$() {
  if ((!$n_Ljapgolly_scalajs_react_Callback$)) {
    $n_Ljapgolly_scalajs_react_Callback$ = new $c_Ljapgolly_scalajs_react_Callback$().init___()
  };
  return $n_Ljapgolly_scalajs_react_Callback$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CallbackTo() {
  $c_O.call(this);
  this.japgolly$scalajs$react$CallbackTo$$f$1 = null
}
$c_Ljapgolly_scalajs_react_CallbackTo.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.constructor = $c_Ljapgolly_scalajs_react_CallbackTo;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CallbackTo() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CallbackTo.prototype = $c_Ljapgolly_scalajs_react_CallbackTo.prototype;
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.init___F0 = (function(f) {
  this.japgolly$scalajs$react$CallbackTo$$f$1 = f;
  return this
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().equals$extension__F0__O__Z(this.japgolly$scalajs$react$CallbackTo$$f$1, x$1)
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.hashCode__I = (function() {
  var $$this = this.japgolly$scalajs$react$CallbackTo$$f$1;
  return $systemIdentityHashCode($$this)
});
function $is_Ljapgolly_scalajs_react_CallbackTo(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CallbackTo)))
}
function $as_Ljapgolly_scalajs_react_CallbackTo(obj) {
  return (($is_Ljapgolly_scalajs_react_CallbackTo(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CallbackTo"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CallbackTo)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CallbackTo(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CallbackTo;", depth))
}
var $d_Ljapgolly_scalajs_react_CallbackTo = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CallbackTo: 0
}, false, "japgolly.scalajs.react.CallbackTo", {
  Ljapgolly_scalajs_react_CallbackTo: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CallbackTo.prototype.$classData = $d_Ljapgolly_scalajs_react_CallbackTo;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CallbackTo$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.constructor = $c_Ljapgolly_scalajs_react_CallbackTo$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CallbackTo$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CallbackTo$.prototype = $c_Ljapgolly_scalajs_react_CallbackTo$.prototype;
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.equals$extension__F0__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_CallbackTo(x$1)) {
    var CallbackTo$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_CallbackTo(x$1).japgolly$scalajs$react$CallbackTo$$f$1);
    return ($$this === CallbackTo$1)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.isEmpty$und$qmark$extension__F0__Z = (function($$this) {
  return ($$this === $m_Ljapgolly_scalajs_react_Callback$().empty$1)
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.toJsFn$extension__F0__sjs_js_Function0 = (function($$this) {
  return (function(f) {
    return (function() {
      return f.apply__O()
    })
  })($$this)
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.$$greater$greater$extension__F0__F0__F0 = (function($$this, runNext) {
  return ($m_Ljapgolly_scalajs_react_CallbackTo$().isEmpty$und$qmark$extension__F0__Z($$this) ? runNext : new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, runNext$1, $$this$1) {
    return (function() {
      $$this$1.apply__O();
      return runNext$1.apply__O()
    })
  })(this, runNext, $$this)))
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.map$extension__F0__F1__Ljapgolly_scalajs_react_CallbackTo$MapGuard__F0 = (function($$this, g, ev) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, $$this$1, g$1) {
    return (function() {
      return g$1.apply__O__O($$this$1.apply__O())
    })
  })(this, $$this, g))
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.flatMap$extension__F0__F1__F0 = (function($$this, g) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, $$this$1, g$1) {
    return (function() {
      return $as_Ljapgolly_scalajs_react_CallbackTo(g$1.apply__O__O($$this$1.apply__O())).japgolly$scalajs$react$CallbackTo$$f$1.apply__O()
    })
  })(this, $$this, g))
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.pure__O__F0 = (function(a) {
  return new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, a$1) {
    return (function() {
      return a$1
    })
  })(this, a))
});
var $d_Ljapgolly_scalajs_react_CallbackTo$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CallbackTo$: 0
}, false, "japgolly.scalajs.react.CallbackTo$", {
  Ljapgolly_scalajs_react_CallbackTo$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CallbackTo$.prototype.$classData = $d_Ljapgolly_scalajs_react_CallbackTo$;
var $n_Ljapgolly_scalajs_react_CallbackTo$ = (void 0);
function $m_Ljapgolly_scalajs_react_CallbackTo$() {
  if ((!$n_Ljapgolly_scalajs_react_CallbackTo$)) {
    $n_Ljapgolly_scalajs_react_CallbackTo$ = new $c_Ljapgolly_scalajs_react_CallbackTo$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CallbackTo$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType.prototype = $c_Ljapgolly_scalajs_react_CtorType.prototype;
function $is_Ljapgolly_scalajs_react_CtorType(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CtorType)))
}
function $as_Ljapgolly_scalajs_react_CtorType(obj) {
  return (($is_Ljapgolly_scalajs_react_CtorType(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CtorType"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CtorType(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CtorType)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CtorType(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CtorType(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CtorType;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Summoner$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Summoner$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Summoner$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype = $c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.formatChildren__sc_Seq__sc_Seq = (function(c) {
  if (c.isEmpty__Z()) {
    return $m_sci_Nil$()
  } else {
    var jsx$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(x$7$2) {
        var x$7 = $as_Ljapgolly_scalajs_react_vdom_VdomNode(x$7$2);
        return x$7.rawNode$1
      })
    })(this));
    var this$1 = $m_sc_Seq$();
    return $as_sc_Seq(c.map__F1__scg_CanBuildFrom__O(jsx$1, this$1.ReusableCBFInstance$2))
  }
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.summonN__Ljapgolly_scalajs_react_internal_Singleton__Ljapgolly_scalajs_react_CtorType$Summoner = (function(s) {
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, s$1) {
    return (function(rc$2) {
      return new $c_Ljapgolly_scalajs_react_CtorType$Nullary().init___O__F1__sjs_js_UndefOr($i_react.createElement(rc$2, s$1.value$1), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, s$1$1, rc) {
        return (function(m$2) {
          var m = $as_Ljapgolly_scalajs_react_CtorType$Mod(m$2).mod$1;
          return $i_react.createElement(rc, $m_Ljapgolly_scalajs_react_CtorType$Mod$().applyAndCast$extension__F1__sjs_js_Object__sjs_js_Object(m, s$1$1.mutableObj$1.apply__O()))
        })
      })($this, s$1, rc$2)), (void 0))
    })
  })(this, s));
  var p = $m_Ljapgolly_scalajs_react_CtorType$ProfunctorN$();
  return new $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1().init___F1__Ljapgolly_scalajs_react_internal_Profunctor(f, p)
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner = (function(w) {
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(rc$2) {
      return new $c_Ljapgolly_scalajs_react_CtorType$Props().init___F2__sjs_js_UndefOr(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this$1, rc) {
        return (function(p$2, mm$2) {
          if ((mm$2 === (void 0))) {
            var p2 = p$2
          } else {
            var x$6 = $as_Ljapgolly_scalajs_react_CtorType$Mod(mm$2).mod$1;
            var p2 = $m_Ljapgolly_scalajs_react_CtorType$Mod$().applyAndCast$extension__F1__sjs_js_Object__sjs_js_Object(x$6, $m_Ljapgolly_scalajs_react_CtorType$Summoner$().prepareForMutation__p1__sjs_js_Object__sjs_js_Object(p$2))
          };
          return $i_react.createElement(rc, p2)
        })
      })($this, rc$2)), (void 0))
    })
  })(this));
  var p = $m_Ljapgolly_scalajs_react_CtorType$ProfunctorP$();
  return new $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1().init___F1__Ljapgolly_scalajs_react_internal_Profunctor(f, p)
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.prepareForMutation__p1__sjs_js_Object__sjs_js_Object = (function(o) {
  return ($uZ((o instanceof $g.Object)) ? o : {})
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.summonPC__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner = (function(w) {
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(rc$2) {
      return new $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren().init___F3__sjs_js_UndefOr(new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this$1, rc) {
        return (function(p$2, mm$2, c$2) {
          var c = $as_sc_Seq(c$2);
          if ((mm$2 === (void 0))) {
            var p2 = p$2
          } else {
            var x$5 = $as_Ljapgolly_scalajs_react_CtorType$Mod(mm$2).mod$1;
            var p2 = $m_Ljapgolly_scalajs_react_CtorType$Mod$().applyAndCast$extension__F1__sjs_js_Object__sjs_js_Object(x$5, $m_Ljapgolly_scalajs_react_CtorType$Summoner$().prepareForMutation__p1__sjs_js_Object__sjs_js_Object(p$2))
          };
          var jsx$1 = $i_react;
          var jsx$4 = jsx$1.createElement;
          var col = $m_Ljapgolly_scalajs_react_CtorType$Summoner$().formatChildren__sc_Seq__sc_Seq(c);
          var this$7 = $m_sjsr_Compat$();
          if ($is_sjs_js_ArrayOps(col)) {
            var x2 = $as_sjs_js_ArrayOps(col);
            var jsx$3 = x2.scala$scalajs$js$ArrayOps$$array$f
          } else if ($is_sjs_js_WrappedArray(col)) {
            var x3 = $as_sjs_js_WrappedArray(col);
            var jsx$3 = x3.array$6
          } else {
            var result = [];
            col.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$2, result$1) {
              return (function(x$2) {
                return $uI(result$1.push(x$2))
              })
            })(this$7, result)));
            var jsx$3 = result
          };
          var jsx$2 = [rc, p2].concat(jsx$3);
          return jsx$4.apply(jsx$1, jsx$2)
        })
      })($this, rc$2)), (void 0))
    })
  })(this));
  var p = $m_Ljapgolly_scalajs_react_CtorType$ProfunctorF$();
  return new $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1().init___F1__Ljapgolly_scalajs_react_internal_Profunctor(f, p)
});
var $d_Ljapgolly_scalajs_react_CtorType$Summoner$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Summoner$: 0
}, false, "japgolly.scalajs.react.CtorType$Summoner$", {
  Ljapgolly_scalajs_react_CtorType$Summoner$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Summoner$;
var $n_Ljapgolly_scalajs_react_CtorType$Summoner$ = (void 0);
function $m_Ljapgolly_scalajs_react_CtorType$Summoner$() {
  if ((!$n_Ljapgolly_scalajs_react_CtorType$Summoner$)) {
    $n_Ljapgolly_scalajs_react_CtorType$Summoner$ = new $c_Ljapgolly_scalajs_react_CtorType$Summoner$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CtorType$Summoner$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Generic$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_Generic$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Generic$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Generic$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Generic$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Generic$.prototype = $c_Ljapgolly_scalajs_react_component_Generic$.prototype;
$c_Ljapgolly_scalajs_react_component_Generic$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_component_Generic$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Generic$: 0
}, false, "japgolly.scalajs.react.component.Generic$", {
  Ljapgolly_scalajs_react_component_Generic$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_Generic$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Generic$;
var $n_Ljapgolly_scalajs_react_component_Generic$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_Generic$() {
  if ((!$n_Ljapgolly_scalajs_react_component_Generic$)) {
    $n_Ljapgolly_scalajs_react_component_Generic$ = new $c_Ljapgolly_scalajs_react_component_Generic$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_Generic$
}
function $f_Ljapgolly_scalajs_react_component_Generic$UnmountedSimple__renderIntoDOM__sjs_js_$bar__F0__O($thiz, container, callback) {
  return $thiz.mountRaw__F1().apply__O__O($i_react$002ddom.render($thiz.raw__Ljapgolly_scalajs_react_raw_React$ComponentElement(), container, $m_Ljapgolly_scalajs_react_CallbackTo$().toJsFn$extension__F0__sjs_js_Function0(callback)))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_InspectRaw$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_InspectRaw$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_InspectRaw$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_InspectRaw$.prototype = $c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype;
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype.invalidComponentDesc$1__p1__sjs_js_Any__T = (function(a) {
  if ($is_T(a)) {
    var x2 = $as_T(a);
    return ((("" + new $c_jl_Character().init___C(34)) + $as_T(x2.split("\n").join("\\n"))) + new $c_jl_Character().init___C(34))
  } else {
    return ($uZ((a instanceof $g.Object)) ? $m_Ljapgolly_scalajs_react_internal_JsUtil$().inspectObject__sjs_js_Object__T(a) : ((a === (void 0)) ? $objectToString(a) : (($objectToString(a) + ": ") + $as_T((typeof a)))))
  }
});
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype.isComponent__sjs_js_Any__Z = (function(a) {
  return $uZ((a instanceof $g.Function))
});
var $d_Ljapgolly_scalajs_react_component_InspectRaw$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_InspectRaw$: 0
}, false, "japgolly.scalajs.react.component.InspectRaw$", {
  Ljapgolly_scalajs_react_component_InspectRaw$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_InspectRaw$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_InspectRaw$;
var $n_Ljapgolly_scalajs_react_component_InspectRaw$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_InspectRaw$() {
  if ((!$n_Ljapgolly_scalajs_react_component_InspectRaw$)) {
    $n_Ljapgolly_scalajs_react_component_InspectRaw$ = new $c_Ljapgolly_scalajs_react_component_InspectRaw$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_InspectRaw$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Scala$() {
  $c_O.call(this);
  this.builder$1 = null;
  this.Lifecycle$1 = null
}
$c_Ljapgolly_scalajs_react_component_Scala$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Scala$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Scala$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Scala$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Scala$.prototype = $c_Ljapgolly_scalajs_react_component_Scala$.prototype;
$c_Ljapgolly_scalajs_react_component_Scala$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_component_Scala$ = this;
  this.builder$1 = $m_Ljapgolly_scalajs_react_component_builder_EntryPoint$();
  this.Lifecycle$1 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$();
  return this
});
var $d_Ljapgolly_scalajs_react_component_Scala$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Scala$: 0
}, false, "japgolly.scalajs.react.component.Scala$", {
  Ljapgolly_scalajs_react_component_Scala$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_Scala$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Scala$;
var $n_Ljapgolly_scalajs_react_component_Scala$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_Scala$() {
  if ((!$n_Ljapgolly_scalajs_react_component_Scala$)) {
    $n_Ljapgolly_scalajs_react_component_Scala$ = new $c_Ljapgolly_scalajs_react_component_Scala$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_Scala$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_ScalaFn$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_ScalaFn$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_ScalaFn$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_ScalaFn$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_ScalaFn$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_ScalaFn$.prototype = $c_Ljapgolly_scalajs_react_component_ScalaFn$.prototype;
$c_Ljapgolly_scalajs_react_component_ScalaFn$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_component_ScalaFn$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_ScalaFn$: 0
}, false, "japgolly.scalajs.react.component.ScalaFn$", {
  Ljapgolly_scalajs_react_component_ScalaFn$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_ScalaFn$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_ScalaFn$;
var $n_Ljapgolly_scalajs_react_component_ScalaFn$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_ScalaFn$() {
  if ((!$n_Ljapgolly_scalajs_react_component_ScalaFn$)) {
    $n_Ljapgolly_scalajs_react_component_ScalaFn$ = new $c_Ljapgolly_scalajs_react_component_ScalaFn$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_ScalaFn$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Builder$() {
  $c_O.call(this);
  this.japgolly$scalajs$react$component$builder$Builder$$InitStateUnit$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Builder$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Builder$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Builder$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_component_builder_Builder$ = this;
  this.japgolly$scalajs$react$component$builder$Builder$$InitStateUnit$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$1$2) {
      return $m_Ljapgolly_scalajs_react_internal_Box$().Unit$1
    })
  })(this));
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype.fromReactComponentClass__sjs_js_Function1__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(rc, ctorType) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var x = $m_Ljapgolly_scalajs_react_component_Js$().component__sjs_js_Function1__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(rc, ctorType);
  return x.cmapCtorProps__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$15$2) {
      $m_Ljapgolly_scalajs_react_internal_Box$();
      return {
        "a": x$15$2
      }
    })
  })(this))).mapUnmounted__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
    return (function(x$16$2) {
      var x$16 = $as_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(x$16$2);
      return x$16.mapUnmountedProps__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1) {
        return (function(x$17$2) {
          return x$17$2.a
        })
      })(this$2$1))).mapMounted__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$2) {
        return (function(x$2) {
          var x$1 = $as_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(x$2);
          $m_Ljapgolly_scalajs_react_component_Scala$();
          return new $c_Ljapgolly_scalajs_react_component_Scala$$anon$1().init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot(x$1)
        })
      })(this$2$1)))
    })
  })(this)))
});
var $d_Ljapgolly_scalajs_react_component_builder_Builder$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Builder$: 0
}, false, "japgolly.scalajs.react.component.builder.Builder$", {
  Ljapgolly_scalajs_react_component_builder_Builder$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Builder$;
var $n_Ljapgolly_scalajs_react_component_builder_Builder$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Builder$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Builder$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Builder$ = new $c_Ljapgolly_scalajs_react_component_builder_Builder$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Builder$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1() {
  $c_O.call(this);
  this.name$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Builder$Step1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype.stateless__Ljapgolly_scalajs_react_component_builder_Builder$Step2 = (function() {
  return new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step2().init___T__F1(this.name$1, $m_Ljapgolly_scalajs_react_component_builder_Builder$().japgolly$scalajs$react$component$builder$Builder$$InitStateUnit$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype.init___T = (function(name) {
  this.name$1 = name;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype.initialState__F0__Ljapgolly_scalajs_react_component_builder_Builder$Step2 = (function(s) {
  return new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step2().init___T__F1(this.name$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, s$1) {
    return (function(x$2$2) {
      $m_Ljapgolly_scalajs_react_internal_Box$();
      var value = s$1.apply__O();
      return {
        "a": value
      }
    })
  })(this, s)))
});
var $d_Ljapgolly_scalajs_react_component_builder_Builder$Step1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Builder$Step1: 0
}, false, "japgolly.scalajs.react.component.builder.Builder$Step1", {
  Ljapgolly_scalajs_react_component_builder_Builder$Step1: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step1.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Builder$Step1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Builder$Step2() {
  $c_O.call(this);
  this.name$1 = null;
  this.initStateFn$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Builder$Step2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype.backend__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step3 = (function(f) {
  return new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step3().init___T__F1__F1(this.name$1, this.initStateFn$1, f)
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype.noBackend__Ljapgolly_scalajs_react_component_builder_Builder$Step3 = (function() {
  return this.backend__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step3(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$4$2) {
      $as_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$4$2)
    })
  })(this)))
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype.init___T__F1 = (function(name, initStateFn) {
  this.name$1 = name;
  this.initStateFn$1 = initStateFn;
  return this
});
var $d_Ljapgolly_scalajs_react_component_builder_Builder$Step2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Builder$Step2: 0
}, false, "japgolly.scalajs.react.component.builder.Builder$Step2", {
  Ljapgolly_scalajs_react_component_builder_Builder$Step2: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step2.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Builder$Step2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Builder$Step3() {
  $c_O.call(this);
  this.name$1 = null;
  this.initStateFn$1 = null;
  this.backendFn$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step3;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Builder$Step3() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype.renderWith__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4 = (function(r) {
  return new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step4().init___T__F1__F1__F1__Ljapgolly_scalajs_react_component_builder_Lifecycle(this.name$1, this.initStateFn$1, this.backendFn$1, r, new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle().init___s_Option__s_Option__s_Option__s_Option__s_Option__s_Option__s_Option__s_Option($m_s_None$(), $m_s_None$(), $m_s_None$(), $m_s_None$(), $m_s_None$(), $m_s_None$(), $m_s_None$(), $m_s_None$()))
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype.init___T__F1__F1 = (function(name, initStateFn, backendFn) {
  this.name$1 = name;
  this.initStateFn$1 = initStateFn;
  this.backendFn$1 = backendFn;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype.render$undP__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4 = (function(r) {
  return this.renderWith__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, r$1) {
    return (function($$$) {
      var $$ = $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope($$$).raw$1;
      return $as_Ljapgolly_scalajs_react_vdom_VdomNode(r$1.apply__O__O($m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$)))
    })
  })(this, r)))
});
var $d_Ljapgolly_scalajs_react_component_builder_Builder$Step3 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Builder$Step3: 0
}, false, "japgolly.scalajs.react.component.builder.Builder$Step3", {
  Ljapgolly_scalajs_react_component_builder_Builder$Step3: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step3.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Builder$Step3;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Builder$Step4() {
  $c_O.call(this);
  this.name$1 = null;
  this.initStateFn$1 = null;
  this.backendFn$1 = null;
  this.renderFn$1 = null;
  this.lifecycle$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step4;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Builder$Step4() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype = $c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype.init___T__F1__F1__F1__Ljapgolly_scalajs_react_component_builder_Lifecycle = (function(name, initStateFn, backendFn, renderFn, lifecycle) {
  this.name$1 = name;
  this.initStateFn$1 = initStateFn;
  this.backendFn$1 = backendFn;
  this.renderFn$1 = renderFn;
  this.lifecycle$1 = lifecycle;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype.build__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(ctorType) {
  var c = $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().apply__Ljapgolly_scalajs_react_component_builder_Builder$Step4__sjs_js_Function1(this);
  return $m_Ljapgolly_scalajs_react_component_builder_Builder$().fromReactComponentClass__sjs_js_Function1__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(c, ctorType)
});
var $d_Ljapgolly_scalajs_react_component_builder_Builder$Step4 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Builder$Step4: 0
}, false, "japgolly.scalajs.react.component.builder.Builder$Step4", {
  Ljapgolly_scalajs_react_component_builder_Builder$Step4: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Builder$Step4.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Builder$Step4;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_EntryPoint$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_EntryPoint$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_EntryPoint$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype = $c_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_component_builder_EntryPoint$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_EntryPoint$: 0
}, false, "japgolly.scalajs.react.component.builder.EntryPoint$", {
  Ljapgolly_scalajs_react_component_builder_EntryPoint$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_EntryPoint$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_EntryPoint$;
var $n_Ljapgolly_scalajs_react_component_builder_EntryPoint$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_EntryPoint$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_EntryPoint$)) {
    $n_Ljapgolly_scalajs_react_component_builder_EntryPoint$ = new $c_Ljapgolly_scalajs_react_component_builder_EntryPoint$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_EntryPoint$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T = (function($$this) {
  var jsx$2 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$();
  var jsx$1 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$this);
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return jsx$2.japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((("ComponentDidMount(props: " + jsx$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).state__O()) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.props$extension__Ljapgolly_scalajs_react_raw_React$Component__O = (function($$this) {
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).props__O()
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(x$1)) {
    var ComponentDidMount$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(x$1).raw$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z($$this, ComponentDidMount$1)
  } else {
    return false
  }
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentDidMount$", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$;
var $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$ = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T = (function($$this) {
  var jsx$2 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$();
  var jsx$1 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$this);
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return jsx$2.japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((("ComponentWillMount(props: " + jsx$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).state__O()) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.props$extension__Ljapgolly_scalajs_react_raw_React$Component__O = (function($$this) {
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).props__O()
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(x$1)) {
    var ComponentWillMount$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(x$1).raw$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z($$this, ComponentWillMount$1)
  } else {
    return false
  }
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillMount$", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$;
var $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$ = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T = (function($$this) {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((("ComponentWillUnmount(props: " + $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$this)) + ", state: ") + $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$().state$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$this)) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.props$extension__Ljapgolly_scalajs_react_raw_React$Component__O = (function($$this) {
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).props__O()
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.state$extension__Ljapgolly_scalajs_react_raw_React$Component__O = (function($$this) {
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).state__O()
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(x$1)) {
    var ComponentWillUnmount$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(x$1).raw$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z($$this, ComponentWillUnmount$1)
  } else {
    return false
  }
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillUnmount$", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$;
var $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$ = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T = (function($$this) {
  var jsx$2 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$();
  var jsx$1 = $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O($$this);
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return jsx$2.japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((("Render(props: " + jsx$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).state__O()) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.props$extension__Ljapgolly_scalajs_react_raw_React$Component__O = (function($$this) {
  var this$1 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component($$this);
  return $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$1).props__O()
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(x$1)) {
    var RenderScope$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(x$1).raw$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z($$this, RenderScope$1)
  } else {
    return false
  }
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$RenderScope$", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$;
var $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$ = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$() {
  $c_O.call(this);
  this.x$4$1 = null;
  this.$$undgetPrototypeOf$1 = null;
  this.$$undsetPrototypeOf$1 = null;
  this.ReactComponent$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype = $c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.add2$1__p1__T__F3__sjs_js_Array__V = (function(k, f, methods$1) {
  this.add$1__p1__T__sjs_js_Any__sjs_js_Array__V(k, (function(f$1) {
    return (function(arg1, arg2) {
      return f$1.apply__O__O__O__O(this, arg1, arg2)
    })
  })(f), methods$1)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$ = this;
  var f = $g.Object.setPrototypeOf;
  var x1 = ((f === (void 0)) ? $m_s_None$() : new $c_s_Some().init___O(f));
  if ($is_s_Some(x1)) {
    var x2 = $as_s_Some(x1);
    var set = x2.value$2;
    var _1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(o$2) {
        return $g.Object.getPrototypeOf(o$2)
      })
    })(this));
    var x1$2_$_$$und1$f = _1;
    var x1$2_$_$$und2$f = set
  } else {
    var x = $m_s_None$();
    if ((!(x === x1))) {
      throw new $c_s_MatchError().init___O(x1)
    };
    var get = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
      return (function(x$1$2) {
        return x$1$2.__proto__
      })
    })(this));
    var set$2 = (function(arg1$2, arg2$2) {
      $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().japgolly$scalajs$react$component$builder$ViaReactComponent$$$anonfun$x$4$3__sjs_js_Object__sjs_js_Object__V(arg1$2, arg2$2)
    });
    var x1$2_$_$$und1$f = get;
    var x1$2_$_$$und2$f = set$2
  };
  var _getPrototypeOf = $as_F1(x1$2_$_$$und1$f);
  var _setPrototypeOf = x1$2_$_$$und2$f;
  this.x$4$1 = new $c_T2().init___O__O(_getPrototypeOf, _setPrototypeOf);
  this.$$undgetPrototypeOf$1 = $as_F1(this.x$4$1.$$und1$f);
  this.$$undsetPrototypeOf$1 = this.x$4$1.$$und2$f;
  this.ReactComponent$1 = $i_react.Component;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.$$unddefineProperties__p1__sjs_js_Object__sjs_js_Array__V = (function(target, props) {
  var i = 0;
  var len = $uI(props.length);
  while ((i < len)) {
    var index = i;
    var arg1 = props[index];
    arg1.configurable = true;
    if ($uZ(("value" in arg1))) {
      arg1.writable = true
    };
    $g.Object.defineProperty(target, $as_T(arg1.key), arg1);
    i = ((1 + i) | 0)
  }
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.japgolly$scalajs$react$component$builder$ViaReactComponent$$$anonfun$x$4$3__sjs_js_Object__sjs_js_Object__V = (function(x$2, x$3) {
  x$2.__proto__ = x$3
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.japgolly$scalajs$react$component$builder$ViaReactComponent$$$anonfun$apply$1__Ljapgolly_scalajs_react_raw_React$Component__Ljapgolly_scalajs_react_internal_Box__F1__F1__sr_ObjectRef__Ljapgolly_scalajs_react_raw_React$Component = (function($this, props, initStateFn$1, backendFn$1, MyComponent$1) {
  var _this = $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().$$undpossibleConstructorReturn__p1__sjs_js_Any__sjs_js_Any__sjs_js_Any($this, $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().$$undgetPrototypeOf$1.apply__O__O(MyComponent$1.elem$1).call($this, props));
  $m_Ljapgolly_scalajs_react_component_Js$();
  var this$2 = new $c_Ljapgolly_scalajs_react_component_Js$$anon$1().init___Ljapgolly_scalajs_react_raw_React$Component(_this);
  _this.mountedImpure = ($m_Ljapgolly_scalajs_react_component_Scala$(), new $c_Ljapgolly_scalajs_react_component_Scala$$anon$1().init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot(this$2));
  var this$4 = $as_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(_this.mountedImpure);
  var t = $m_Ljapgolly_scalajs_react_internal_Effect$Trans$().idToCallback$1;
  _this.mountedPure = $as_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$4.withEffect__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(t));
  _this.backend = backendFn$1.apply__O__O($as_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(_this.mountedPure));
  _this.state = initStateFn$1.apply__O__O(props);
  return _this
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.apply__Ljapgolly_scalajs_react_component_builder_Builder$Step4__sjs_js_Function1 = (function(builder) {
  var initStateFn = builder.initStateFn$1;
  var backendFn = builder.backendFn$1;
  var renderFn = builder.renderFn$1;
  var MyComponent = new $c_sr_ObjectRef().init___O(null);
  MyComponent.elem$1 = (function(initStateFn$1, backendFn$1, MyComponent$1) {
    return (function(arg1$2) {
      return $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().japgolly$scalajs$react$component$builder$ViaReactComponent$$$anonfun$apply$1__Ljapgolly_scalajs_react_raw_React$Component__Ljapgolly_scalajs_react_internal_Box__F1__F1__sr_ObjectRef__Ljapgolly_scalajs_react_raw_React$Component(this, arg1$2, initStateFn$1, backendFn$1, MyComponent$1)
    })
  })(initStateFn, backendFn, MyComponent);
  this.$$undinherits__p1__sjs_js_Object__sjs_js_Object__V(MyComponent.elem$1, this.ReactComponent$1);
  var methods = [];
  this.add0$1__p1__T__F1__sjs_js_Array__V("render", new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, renderFn$1) {
    return (function(_this$2) {
      return $as_Ljapgolly_scalajs_react_vdom_VdomNode(renderFn$1.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(_this$2))).rawNode$1
    })
  })(this, renderFn)), methods);
  var this$2 = builder.lifecycle$1.componentDidCatch$1;
  if ((!this$2.isEmpty__Z())) {
    var arg1 = this$2.get__O();
    var f = $as_F1(arg1);
    this.add2$1__p1__T__F3__sjs_js_Array__V("componentDidCatch", new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this$1, f$1) {
      return (function(_this$2$1, e$2, i$2) {
        var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(f$1.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch().init___Ljapgolly_scalajs_react_raw_React$Component__Ljapgolly_scalajs_react_raw_React$Error__Ljapgolly_scalajs_react_raw_React$ErrorInfo(_this$2$1, e$2, i$2))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this.apply__O()
      })
    })(this, f)), methods)
  };
  var this$4 = builder.lifecycle$1.componentDidMount$1;
  if ((!this$4.isEmpty__Z())) {
    var arg1$1 = this$4.get__O();
    var f$3 = $as_F1(arg1$1);
    this.add0$1__p1__T__F1__sjs_js_Array__V("componentDidMount", new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$2, f$2) {
      return (function(_this$2$2) {
        var $$this$1 = $as_Ljapgolly_scalajs_react_CallbackTo(f$2.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount().init___Ljapgolly_scalajs_react_raw_React$Component(_this$2$2))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$1.apply__O()
      })
    })(this, f$3)), methods)
  };
  var this$6 = builder.lifecycle$1.componentDidUpdate$1;
  if ((!this$6.isEmpty__Z())) {
    var arg1$3 = this$6.get__O();
    var f$4 = $as_F1(arg1$3);
    this.add2$1__p1__T__F3__sjs_js_Array__V("componentDidUpdate", new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this$3, f$5) {
      return (function(_this$2$3, p$2, s$2) {
        var $$this$2 = $as_Ljapgolly_scalajs_react_CallbackTo(f$5.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate().init___Ljapgolly_scalajs_react_raw_React$Component__O__O(_this$2$3, p$2.a, s$2.a))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$2.apply__O()
      })
    })(this, f$4)), methods)
  };
  var this$8 = builder.lifecycle$1.componentWillMount$1;
  if ((!this$8.isEmpty__Z())) {
    var arg1$4 = this$8.get__O();
    var f$5$1 = $as_F1(arg1$4);
    this.add0$1__p1__T__F1__sjs_js_Array__V("componentWillMount", new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$4, f$6) {
      return (function(_this$2$4) {
        var $$this$3 = $as_Ljapgolly_scalajs_react_CallbackTo(f$6.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount().init___Ljapgolly_scalajs_react_raw_React$Component(_this$2$4))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$3.apply__O()
      })
    })(this, f$5$1)), methods)
  };
  var this$10 = builder.lifecycle$1.componentWillReceiveProps$1;
  if ((!this$10.isEmpty__Z())) {
    var arg1$5 = this$10.get__O();
    var f$6$1 = $as_F1(arg1$5);
    this.add1$1__p1__T__F2__sjs_js_Array__V("componentWillReceiveProps", new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this$5, f$7) {
      return (function(_this$2$5, p$2$1) {
        var $$this$4 = $as_Ljapgolly_scalajs_react_CallbackTo(f$7.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps().init___Ljapgolly_scalajs_react_raw_React$Component__O(_this$2$5, p$2$1.a))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$4.apply__O()
      })
    })(this, f$6$1)), methods)
  };
  var this$12 = builder.lifecycle$1.componentWillUnmount$1;
  if ((!this$12.isEmpty__Z())) {
    var arg1$6 = this$12.get__O();
    var f$7$1 = $as_F1(arg1$6);
    this.add0$1__p1__T__F1__sjs_js_Array__V("componentWillUnmount", new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$6, f$8) {
      return (function(_this$2$6) {
        var $$this$5 = $as_Ljapgolly_scalajs_react_CallbackTo(f$8.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount().init___Ljapgolly_scalajs_react_raw_React$Component(_this$2$6))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$5.apply__O()
      })
    })(this, f$7$1)), methods)
  };
  var this$14 = builder.lifecycle$1.componentWillUpdate$1;
  if ((!this$14.isEmpty__Z())) {
    var arg1$7 = this$14.get__O();
    var f$8$1 = $as_F1(arg1$7);
    this.add2$1__p1__T__F3__sjs_js_Array__V("componentWillUpdate", new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this$7, f$9) {
      return (function(_this$2$7, p$2$2, s$2$1) {
        var $$this$6 = $as_Ljapgolly_scalajs_react_CallbackTo(f$9.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate().init___Ljapgolly_scalajs_react_raw_React$Component__O__O(_this$2$7, p$2$2.a, s$2$1.a))).japgolly$scalajs$react$CallbackTo$$f$1;
        $$this$6.apply__O()
      })
    })(this, f$8$1)), methods)
  };
  var this$16 = builder.lifecycle$1.shouldComponentUpdate$1;
  if ((!this$16.isEmpty__Z())) {
    var arg1$8 = this$16.get__O();
    var f$9$1 = $as_F1(arg1$8);
    this.add2$1__p1__T__F3__sjs_js_Array__V("shouldComponentUpdate", new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this$8, f$10) {
      return (function(_this$2$8, p$2$3, s$2$2) {
        var $$this$7 = $as_Ljapgolly_scalajs_react_CallbackTo(f$10.apply__O__O(new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate().init___Ljapgolly_scalajs_react_raw_React$Component__O__O(_this$2$8, p$2$3.a, s$2$2.a))).japgolly$scalajs$react$CallbackTo$$f$1;
        return $uZ($$this$7.apply__O())
      })
    })(this, f$9$1)), methods)
  };
  this.$$undcreateClass__p1__sjs_js_Object__sjs_js_Array__V(MyComponent.elem$1, methods);
  var this$18 = $m_s_Option$().apply__O__s_Option(builder.name$1);
  if ((!this$18.isEmpty__Z())) {
    var arg1$9 = this$18.get__O();
    var n = $as_T(arg1$9);
    MyComponent.elem$1.displayName = n
  };
  return MyComponent.elem$1
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.$$undpossibleConstructorReturn__p1__sjs_js_Any__sjs_js_Any__sjs_js_Any = (function(self, call) {
  return (($uZ((call instanceof $g.Object)) || $uZ((call instanceof $g.Function))) ? call : self)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.add0$1__p1__T__F1__sjs_js_Array__V = (function(k, f, methods$1) {
  this.add$1__p1__T__sjs_js_Any__sjs_js_Array__V(k, (function(f$1) {
    return (function() {
      return f$1.apply__O__O(this)
    })
  })(f), methods$1)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.add$1__p1__T__sjs_js_Any__sjs_js_Array__V = (function(k, v, methods$1) {
  methods$1.push(this.Method__p1__T__sjs_js_Any__Ljapgolly_scalajs_react_component_builder_ViaReactComponent$Method(k, v))
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.$$undcreateClass__p1__sjs_js_Object__sjs_js_Array__V = (function(c, protoProps) {
  this.$$unddefineProperties__p1__sjs_js_Object__sjs_js_Array__V(c.prototype, protoProps)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.add1$1__p1__T__F2__sjs_js_Array__V = (function(k, f, methods$1) {
  this.add$1__p1__T__sjs_js_Any__sjs_js_Array__V(k, (function(f$1) {
    return (function(arg1) {
      return f$1.apply__O__O__O(this, arg1)
    })
  })(f), methods$1)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.$$undinherits__p1__sjs_js_Object__sjs_js_Object__V = (function(subClass, superClass) {
  subClass.prototype = $g.Object.create(superClass.prototype, {
    "constructor": {
      "value": subClass,
      "enumerable": false,
      "writable": true,
      "configurable": true
    }
  });
  (0, this.$$undsetPrototypeOf$1)(subClass, superClass)
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.Method__p1__T__sjs_js_Any__Ljapgolly_scalajs_react_component_builder_ViaReactComponent$Method = (function(_key, _value) {
  return {
    "key": _key,
    "value": _value
  }
});
var $d_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_ViaReactComponent$: 0
}, false, "japgolly.scalajs.react.component.builder.ViaReactComponent$", {
  Ljapgolly_scalajs_react_component_builder_ViaReactComponent$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$;
var $n_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$)) {
    $n_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$ = new $c_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_ViaReactComponent$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Box$() {
  $c_O.call(this);
  this.Unit$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Box$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Box$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Box$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Box$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Box$.prototype = $c_Ljapgolly_scalajs_react_internal_Box$.prototype;
$c_Ljapgolly_scalajs_react_internal_Box$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_Box$ = this;
  this.Unit$1 = ($m_Ljapgolly_scalajs_react_internal_Box$(), {
    "a": (void 0)
  });
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Box$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Box$: 0
}, false, "japgolly.scalajs.react.internal.Box$", {
  Ljapgolly_scalajs_react_internal_Box$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Box$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Box$;
var $n_Ljapgolly_scalajs_react_internal_Box$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_Box$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_Box$)) {
    $n_Ljapgolly_scalajs_react_internal_Box$ = new $c_Ljapgolly_scalajs_react_internal_Box$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_Box$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_internal_Effect.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Effect.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect.prototype = $c_Ljapgolly_scalajs_react_internal_Effect.prototype;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$() {
  $c_O.call(this);
  this.idInstance$1 = null;
  this.callbackInstance$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Effect$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Effect$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_Effect$ = this;
  this.idInstance$1 = new $c_Ljapgolly_scalajs_react_internal_Effect$$anon$1().init___();
  this.callbackInstance$1 = new $c_Ljapgolly_scalajs_react_internal_Effect$$anon$2().init___();
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Effect$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$: 0
}, false, "japgolly.scalajs.react.internal.Effect$", {
  Ljapgolly_scalajs_react_internal_Effect$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$;
var $n_Ljapgolly_scalajs_react_internal_Effect$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_Effect$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_Effect$)) {
    $n_Ljapgolly_scalajs_react_internal_Effect$ = new $c_Ljapgolly_scalajs_react_internal_Effect$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_Effect$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$Trans() {
  $c_O.call(this);
  this.from$1 = null;
  this.to$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$Trans;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$Trans() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.apply__F0__O = (function(f) {
  var fn = this.from$1.extract__F0__F0(f);
  return this.to$1.point__F0__O(fn)
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.compose__Ljapgolly_scalajs_react_internal_Effect$Trans__s_Predef$$less$colon$less__Ljapgolly_scalajs_react_internal_Effect$Trans = (function(t, ev) {
  if ((ev === null)) {
    return new $c_Ljapgolly_scalajs_react_internal_Effect$Trans().init___Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect(this.from$1, t.to$1)
  } else {
    $m_Ljapgolly_scalajs_react_internal_Effect$Trans$();
    var F = this.from$1;
    var x = new $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id().init___Ljapgolly_scalajs_react_internal_Effect(F);
    return x
  }
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.init___Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect = (function(from, to) {
  this.from$1 = from;
  this.to$1 = to;
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Effect$Trans = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$Trans: 0
}, false, "japgolly.scalajs.react.internal.Effect$Trans", {
  Ljapgolly_scalajs_react_internal_Effect$Trans: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$Trans;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$Trans$() {
  $c_O.call(this);
  this.endoId$1 = null;
  this.endoCallback$1 = null;
  this.idToCallback$1 = null;
  this.callbackToId$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$Trans$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$Trans$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_Effect$Trans$ = this;
  $m_Ljapgolly_scalajs_react_internal_Effect$Trans$();
  var F = $m_Ljapgolly_scalajs_react_internal_Effect$().idInstance$1;
  this.endoId$1 = new $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id().init___Ljapgolly_scalajs_react_internal_Effect(F);
  $m_Ljapgolly_scalajs_react_internal_Effect$Trans$();
  var F$1 = $m_Ljapgolly_scalajs_react_internal_Effect$().callbackInstance$1;
  this.endoCallback$1 = new $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id().init___Ljapgolly_scalajs_react_internal_Effect(F$1);
  this.idToCallback$1 = $m_Ljapgolly_scalajs_react_internal_Effect$Trans$().apply__Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect__s_Predef$$eq$colon$eq__Ljapgolly_scalajs_react_internal_Effect$Trans($m_Ljapgolly_scalajs_react_internal_Effect$().idInstance$1, $m_Ljapgolly_scalajs_react_internal_Effect$().callbackInstance$1, ($m_Ljapgolly_scalajs_react_internal_Effect$Trans$(), null));
  this.callbackToId$1 = $m_Ljapgolly_scalajs_react_internal_Effect$Trans$().apply__Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect__s_Predef$$eq$colon$eq__Ljapgolly_scalajs_react_internal_Effect$Trans($m_Ljapgolly_scalajs_react_internal_Effect$().callbackInstance$1, $m_Ljapgolly_scalajs_react_internal_Effect$().idInstance$1, ($m_Ljapgolly_scalajs_react_internal_Effect$Trans$(), null));
  return this
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype.apply__Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect__s_Predef$$eq$colon$eq__Ljapgolly_scalajs_react_internal_Effect$Trans = (function(F, G, ev) {
  if ((ev === null)) {
    return new $c_Ljapgolly_scalajs_react_internal_Effect$Trans().init___Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect(F, G)
  } else {
    var x = new $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id().init___Ljapgolly_scalajs_react_internal_Effect(F);
    return x
  }
});
var $d_Ljapgolly_scalajs_react_internal_Effect$Trans$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$Trans$: 0
}, false, "japgolly.scalajs.react.internal.Effect$Trans$", {
  Ljapgolly_scalajs_react_internal_Effect$Trans$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$Trans$;
var $n_Ljapgolly_scalajs_react_internal_Effect$Trans$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_Effect$Trans$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_Effect$Trans$)) {
    $n_Ljapgolly_scalajs_react_internal_Effect$Trans$ = new $c_Ljapgolly_scalajs_react_internal_Effect$Trans$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_Effect$Trans$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_JsUtil$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_JsUtil$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_JsUtil$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_JsUtil$.prototype = $c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype;
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype.inspectObject__sjs_js_Object__T = (function(o) {
  var this$1 = this.objectIterator__sjs_js_Object__sc_Iterator(o);
  $m_sci_Vector$();
  var cbf = $m_sc_IndexedSeq$().ReusableCBF$6;
  var this$3 = $as_sci_Vector($f_sc_TraversableOnce__to__scg_CanBuildFrom__O(this$1, cbf));
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$1$2) {
      var x$1 = $as_T2(x$1$2);
      return $as_T(x$1.$$und1$f)
    })
  })(this));
  var ord = $m_s_math_Ordering$String$();
  var s = $as_sci_Vector($f_sc_SeqLike__sortBy__F1__s_math_Ordering__O(this$3, f, ord));
  if ($f_sc_SeqLike__isEmpty__Z(s)) {
    return ("Value has no object properties: " + o)
  } else {
    $m_sci_Vector$();
    var bf = $m_sc_IndexedSeq$().ReusableCBF$6;
    var b = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder(s, bf);
    var this$5 = s.iterator__sci_VectorIterator();
    while (this$5.$$undhasNext$2) {
      var arg1 = this$5.next__O();
      var x0$1 = $as_T2(arg1);
      if ((x0$1 === null)) {
        throw new $c_s_MatchError().init___O(x0$1)
      };
      var k = $as_T(x0$1.$$und1$f);
      var v = x0$1.$$und2$f;
      var jsx$1 = $as_T((typeof v));
      var x = ("" + v);
      var this$7 = new $c_sci_StringOps().init___T(x);
      b.$$plus$eq__O__scm_Builder(new $c_T3().init___O__O__O(k, jsx$1, $f_sci_StringLike__split__C__AT(this$7, 10).get(0)))
    };
    var ss = $as_sci_Vector(b.result__O());
    var sz = s.length__I();
    var thiz = ("" + sz);
    var nlen = $uI(thiz.length);
    $m_sci_Vector$();
    var bf$1 = $m_sc_IndexedSeq$().ReusableCBF$6;
    var b$1 = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder(ss, bf$1);
    var this$11 = ss.iterator__sci_VectorIterator();
    while (this$11.$$undhasNext$2) {
      var arg1$1 = this$11.next__O();
      var x$2 = $as_T3(arg1$1);
      var thiz$1 = $as_T(x$2.$$und1$1);
      b$1.$$plus$eq__O__scm_Builder($uI(thiz$1.length))
    };
    var klen = $uI($as_sc_TraversableOnce(b$1.result__O()).max__s_math_Ordering__O($m_s_math_Ordering$Int$()));
    $m_sci_Vector$();
    var bf$2 = $m_sc_IndexedSeq$().ReusableCBF$6;
    var b$2 = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder(ss, bf$2);
    var this$14 = ss.iterator__sci_VectorIterator();
    while (this$14.$$undhasNext$2) {
      var arg1$2 = this$14.next__O();
      var x$3 = $as_T3(arg1$2);
      var thiz$2 = $as_T(x$3.$$und2$1);
      b$2.$$plus$eq__O__scm_Builder($uI(thiz$2.length))
    };
    var tlen = $uI($as_sc_TraversableOnce(b$2.result__O()).max__s_math_Ordering__O($m_s_math_Ordering$Int$()));
    var fmt = (((((((("  [%" + nlen) + "d/") + sz) + "] %-") + klen) + "s : %-") + tlen) + "s = %s");
    var elem$1 = 0;
    elem$1 = 0;
    $m_sci_Vector$();
    var bf$3 = $m_sc_IndexedSeq$().ReusableCBF$6;
    var b$3 = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder(ss, bf$3);
    var this$18 = ss.iterator__sci_VectorIterator();
    while (this$18.$$undhasNext$2) {
      var arg1$3 = this$18.next__O();
      var x0$2 = $as_T3(arg1$3);
      if ((x0$2 === null)) {
        throw new $c_s_MatchError().init___O(x0$2)
      };
      var k$1 = $as_T(x0$2.$$und1$1);
      var t = $as_T(x0$2.$$und2$1);
      var v$1 = $as_T(x0$2.$$und3$1);
      elem$1 = ((1 + elem$1) | 0);
      var this$22 = new $c_sci_StringOps().init___T(fmt);
      var array = [elem$1, k$1, t, v$1];
      var args = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
      b$3.$$plus$eq__O__scm_Builder($f_sci_StringLike__format__sc_Seq__T(this$22, args))
    };
    return $as_sc_TraversableOnce(b$3.result__O()).mkString__T__T__T__T((o + "\n"), "\n", "")
  }
});
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype.objectIterator__sjs_js_Object__sc_Iterator = (function(o) {
  var array = $propertiesOf(o);
  var this$2 = new $c_sjs_js_ArrayOps().init___sjs_js_Array(array);
  var this$5 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this$2, 0, $uI(this$2.scala$scalajs$js$ArrayOps$$array$f.length));
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, d) {
    return (function(n$2) {
      var n = $as_T(n$2);
      try {
        var v = d[n]
      } catch (e) {
        var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
        if ((e$2 !== null)) {
          var v = e$2.toString__T()
        } else {
          var v;
          throw e
        }
      };
      return new $c_T2().init___O__O(n, v)
    })
  })(this, o));
  return new $c_sc_Iterator$$anon$10().init___sc_Iterator__F1(this$5, f)
});
var $d_Ljapgolly_scalajs_react_internal_JsUtil$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_JsUtil$: 0
}, false, "japgolly.scalajs.react.internal.JsUtil$", {
  Ljapgolly_scalajs_react_internal_JsUtil$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_JsUtil$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_JsUtil$;
var $n_Ljapgolly_scalajs_react_internal_JsUtil$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_JsUtil$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_JsUtil$)) {
    $n_Ljapgolly_scalajs_react_internal_JsUtil$ = new $c_Ljapgolly_scalajs_react_internal_JsUtil$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_JsUtil$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Lens() {
  $c_O.call(this);
  this.get$1 = null;
  this.set$1 = null;
  this.mod$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Lens.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Lens.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Lens;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Lens() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Lens.prototype = $c_Ljapgolly_scalajs_react_internal_Lens.prototype;
$c_Ljapgolly_scalajs_react_internal_Lens.prototype.init___F1__F1 = (function(get, set) {
  this.get$1 = get;
  this.set$1 = set;
  this.mod$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(f$2) {
      var f = $as_F1(f$2);
      return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, f$1) {
        return (function(a$2) {
          return $as_F1($this$1.set$1.apply__O__O(f$1.apply__O__O($this$1.get$1.apply__O__O(a$2)))).apply__O__O(a$2)
        })
      })($this, f))
    })
  })(this));
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Lens = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Lens: 0
}, false, "japgolly.scalajs.react.internal.Lens", {
  Ljapgolly_scalajs_react_internal_Lens: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Lens.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Lens;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Lens$() {
  $c_O.call(this);
  this.idInstance$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Lens$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Lens$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Lens$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Lens$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Lens$.prototype = $c_Ljapgolly_scalajs_react_internal_Lens$.prototype;
$c_Ljapgolly_scalajs_react_internal_Lens$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_Lens$ = this;
  this.idInstance$1 = this.$$undid__p1__Ljapgolly_scalajs_react_internal_Lens();
  return this
});
$c_Ljapgolly_scalajs_react_internal_Lens$.prototype.$$undid__p1__Ljapgolly_scalajs_react_internal_Lens = (function() {
  var get = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(a$2) {
      return a$2
    })
  })(this));
  var set = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(a$3$2) {
      return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, a) {
        return (function(x$5$2) {
          return a
        })
      })(this$2, a$3$2))
    })
  })(this));
  return new $c_Ljapgolly_scalajs_react_internal_Lens().init___F1__F1(get, set)
});
var $d_Ljapgolly_scalajs_react_internal_Lens$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Lens$: 0
}, false, "japgolly.scalajs.react.internal.Lens$", {
  Ljapgolly_scalajs_react_internal_Lens$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Lens$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Lens$;
var $n_Ljapgolly_scalajs_react_internal_Lens$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_Lens$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_Lens$)) {
    $n_Ljapgolly_scalajs_react_internal_Lens$ = new $c_Ljapgolly_scalajs_react_internal_Lens$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_Lens$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Profunctor$Ops() {
  $c_O.call(this);
  this.f$1 = null;
  this.p$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Profunctor$Ops;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Profunctor$Ops() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype = $c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype;
$c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype.init___O__Ljapgolly_scalajs_react_internal_Profunctor = (function(f, p) {
  this.f$1 = f;
  this.p$1 = p;
  return this
});
$c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype.dimap__F1__F1__O = (function(l, r) {
  return this.p$1.dimap__O__F1__F1__O(this.f$1, l, r)
});
var $d_Ljapgolly_scalajs_react_internal_Profunctor$Ops = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Profunctor$Ops: 0
}, false, "japgolly.scalajs.react.internal.Profunctor$Ops", {
  Ljapgolly_scalajs_react_internal_Profunctor$Ops: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Profunctor$Ops.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Profunctor$Ops;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Singleton() {
  $c_O.call(this);
  this.value$1 = null;
  this.mutableObj$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Singleton.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Singleton.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Singleton;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Singleton() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Singleton.prototype = $c_Ljapgolly_scalajs_react_internal_Singleton.prototype;
$c_Ljapgolly_scalajs_react_internal_Singleton.prototype.init___O__F0__F0 = (function(value, mutable, mutableObj) {
  this.value$1 = value;
  this.mutableObj$1 = mutableObj;
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Singleton = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Singleton: 0
}, false, "japgolly.scalajs.react.internal.Singleton", {
  Ljapgolly_scalajs_react_internal_Singleton: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Singleton.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Singleton;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Singleton$() {
  $c_O.call(this);
  this.Null$1 = null;
  this.Unit$1 = null;
  this.BoxUnit$1 = null
}
$c_Ljapgolly_scalajs_react_internal_Singleton$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_Singleton$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Singleton$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Singleton$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Singleton$.prototype = $c_Ljapgolly_scalajs_react_internal_Singleton$.prototype;
$c_Ljapgolly_scalajs_react_internal_Singleton$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_Singleton$ = this;
  this.Null$1 = new $c_Ljapgolly_scalajs_react_internal_Singleton().init___O__F0__F0(null, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return null
    })
  })(this)), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$2) {
    return (function() {
      return {}
    })
  })(this)));
  this.Unit$1 = new $c_Ljapgolly_scalajs_react_internal_Singleton().init___O__F0__F0((void 0), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$3) {
    return (function() {
      return (void 0)
    })
  })(this)), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$4) {
    return (function() {
      return {}
    })
  })(this)));
  this.BoxUnit$1 = new $c_Ljapgolly_scalajs_react_internal_Singleton().init___O__F0__F0($m_Ljapgolly_scalajs_react_internal_Box$().Unit$1, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$5) {
    return (function() {
      $m_Ljapgolly_scalajs_react_internal_Box$();
      return {
        "a": (void 0)
      }
    })
  })(this)), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$6) {
    return (function() {
      $m_Ljapgolly_scalajs_react_internal_Box$();
      return {
        "a": (void 0)
      }
    })
  })(this)));
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Singleton$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Singleton$: 0
}, false, "japgolly.scalajs.react.internal.Singleton$", {
  Ljapgolly_scalajs_react_internal_Singleton$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Singleton$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Singleton$;
var $n_Ljapgolly_scalajs_react_internal_Singleton$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_Singleton$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_Singleton$)) {
    $n_Ljapgolly_scalajs_react_internal_Singleton$ = new $c_Ljapgolly_scalajs_react_internal_Singleton$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_Singleton$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_package$() {
  $c_O.call(this);
  this.identityFnInstance$1 = null
}
$c_Ljapgolly_scalajs_react_internal_package$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_internal_package$.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_package$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_package$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_package$.prototype = $c_Ljapgolly_scalajs_react_internal_package$.prototype;
$c_Ljapgolly_scalajs_react_internal_package$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_internal_package$ = this;
  this.identityFnInstance$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(a$2) {
      return a$2
    })
  })(this));
  return this
});
var $d_Ljapgolly_scalajs_react_internal_package$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_package$: 0
}, false, "japgolly.scalajs.react.internal.package$", {
  Ljapgolly_scalajs_react_internal_package$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_package$.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_package$;
var $n_Ljapgolly_scalajs_react_internal_package$ = (void 0);
function $m_Ljapgolly_scalajs_react_internal_package$() {
  if ((!$n_Ljapgolly_scalajs_react_internal_package$)) {
    $n_Ljapgolly_scalajs_react_internal_package$ = new $c_Ljapgolly_scalajs_react_internal_package$().init___()
  };
  return $n_Ljapgolly_scalajs_react_internal_package$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr() {
  $c_O.call(this);
  this.name$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype.equals__O__Z = (function(any) {
  if ($is_Ljapgolly_scalajs_react_vdom_Attr(any)) {
    var x2 = $as_Ljapgolly_scalajs_react_vdom_Attr(any);
    return (this.name$1 === x2.name$1)
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype.toString__T = (function() {
  return (("VdomAttr{name=" + this.name$1) + "}")
});
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype.init___T = (function(name) {
  this.name$1 = name;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Attr.prototype.hashCode__I = (function() {
  return $m_sr_Statics$().anyHash__O__I(this.name$1)
});
function $is_Ljapgolly_scalajs_react_vdom_Attr(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_Attr)))
}
function $as_Ljapgolly_scalajs_react_vdom_Attr(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_Attr(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.Attr"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_Attr(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_Attr)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_Attr(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_Attr(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.Attr;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Attr$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Attr$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr$.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Attr$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Attr$: 0
}, false, "japgolly.scalajs.react.vdom.Attr$", {
  Ljapgolly_scalajs_react_vdom_Attr$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Attr$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Attr$;
var $n_Ljapgolly_scalajs_react_vdom_Attr$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Attr$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Attr$)) {
    $n_Ljapgolly_scalajs_react_vdom_Attr$ = new $c_Ljapgolly_scalajs_react_vdom_Attr$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Attr$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$() {
  $c_O.call(this);
  this.direct$1 = null;
  this.string$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr$ValueType$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_Attr$ValueType$ = this;
  var fn = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(x$6$2, x$7$2) {
      var x$6 = $as_F1(x$6$2);
      x$6.apply__O__O(x$7$2)
    })
  })(this));
  this.direct$1 = fn;
  var fn$1 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(this$2) {
    return (function(x$8$2, x$9$2) {
      var x$8 = $as_F1(x$8$2);
      var x$9 = $as_T(x$9$2);
      x$8.apply__O__O(x$9)
    })
  })(this));
  this.string$1 = fn$1;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype.byImplicit__F1__F2 = (function(f) {
  var fn = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, f$1) {
    return (function(b$2, a$2) {
      var b = $as_F1(b$2);
      b.apply__O__O(f$1.apply__O__O(a$2))
    })
  })(this, f));
  return fn
});
var $d_Ljapgolly_scalajs_react_vdom_Attr$ValueType$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Attr$ValueType$: 0
}, false, "japgolly.scalajs.react.vdom.Attr$ValueType$", {
  Ljapgolly_scalajs_react_vdom_Attr$ValueType$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Attr$ValueType$;
var $n_Ljapgolly_scalajs_react_vdom_Attr$ValueType$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Attr$ValueType$)) {
    $n_Ljapgolly_scalajs_react_vdom_Attr$ValueType$ = new $c_Ljapgolly_scalajs_react_vdom_Attr$ValueType$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Attr$ValueType$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Builder$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Builder$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Builder$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Builder$.prototype = $c_Ljapgolly_scalajs_react_vdom_Builder$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype.nonEmptyObject__sjs_js_Object__sjs_js_UndefOr = (function(o) {
  return (($uI($g.Object.keys(o).length) === 0) ? (void 0) : o)
});
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype.setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V = (function(o, k, v) {
  o[k] = v
});
var $d_Ljapgolly_scalajs_react_vdom_Builder$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Builder$: 0
}, false, "japgolly.scalajs.react.vdom.Builder$", {
  Ljapgolly_scalajs_react_vdom_Builder$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Builder$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Builder$;
var $n_Ljapgolly_scalajs_react_vdom_Builder$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Builder$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Builder$)) {
    $n_Ljapgolly_scalajs_react_vdom_Builder$ = new $c_Ljapgolly_scalajs_react_vdom_Builder$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Builder$
}
function $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__$$init$__V($thiz) {
  $thiz.props$1 = {};
  $thiz.styles$1 = {};
  $thiz.children$1 = [];
  $thiz.key$1 = (void 0);
  $thiz.nonEmptyClassName$1 = (void 0);
  $thiz.addAttr$1 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(x$1$2, x$2$2) {
      var x$1 = $as_T(x$1$2);
      $m_Ljapgolly_scalajs_react_vdom_Builder$().setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V($this.props$1, x$1, x$2$2)
    })
  })($thiz));
  $thiz.addClassName$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(n$2) {
      var value = this$2.nonEmptyClassName$1;
      if ((value === (void 0))) {
        var value$1 = n$2
      } else {
        var s = (("" + $m_s_Predef$any2stringadd$().$$plus$extension__O__T__T(value, " ")) + n$2);
        var value$1 = s
      };
      this$2.nonEmptyClassName$1 = value$1
    })
  })($thiz));
  $thiz.addStyle$1 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(this$3$1) {
    return (function(x$4$2, x$5$2) {
      var x$4 = $as_T(x$4$2);
      $m_Ljapgolly_scalajs_react_vdom_Builder$().setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V(this$3$1.styles$1, x$4, x$5$2)
    })
  })($thiz));
  $thiz.addStylesObject$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$4$1) {
    return (function(o$2) {
      var this$10 = $m_Ljapgolly_scalajs_react_internal_JsUtil$().objectIterator__sjs_js_Object__sc_Iterator(o$2);
      var p = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1) {
        return (function(check$ifrefutable$1$2) {
          var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
          return (check$ifrefutable$1 !== null)
        })
      })(this$4$1));
      var this$11 = new $c_sc_Iterator$$anon$12().init___sc_Iterator__F1(this$10, p);
      while (this$11.hasNext__Z()) {
        var arg1 = this$11.next__O();
        var x$6 = $as_T2(arg1);
        if ((x$6 !== null)) {
          var k = $as_T(x$6.$$und1$f);
          var v = x$6.$$und2$f;
          $asUnit(this$4$1.addStyle$1.apply__O__O__O(k, v))
        } else {
          throw new $c_s_MatchError().init___O(x$6)
        }
      }
    })
  })($thiz));
  $thiz.appendChild$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$5$1) {
    return (function(x$7$2) {
      this$5$1.children$1.push(x$7$2)
    })
  })($thiz));
  $thiz.setKey$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$6$1) {
    return (function(k$2) {
      this$6$1.key$1 = k$2
    })
  })($thiz))
}
function $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__addClassNameToProps__V($thiz) {
  var value = $thiz.nonEmptyClassName$1;
  if ((value !== (void 0))) {
    $m_Ljapgolly_scalajs_react_vdom_Builder$().setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V($thiz.props$1, "className", value)
  }
}
function $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__addStyleToProps__V($thiz) {
  var value = $m_Ljapgolly_scalajs_react_vdom_Builder$().nonEmptyObject__sjs_js_Object__sjs_js_UndefOr($thiz.styles$1);
  if ((value !== (void 0))) {
    $m_Ljapgolly_scalajs_react_vdom_Builder$().setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V($thiz.props$1, "style", value)
  }
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$() {
  $c_O.call(this);
  this.build$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype = $c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$ = this;
  this.build$1 = new $c_sjsr_AnonFunction4().init___sjs_js_Function4((function($this) {
    return (function(tag$2, props$2, key$2, children$2) {
      var tag = $as_T(tag$2);
      if ((key$2 !== (void 0))) {
        $m_Ljapgolly_scalajs_react_vdom_Builder$().setObjectKeyValue__sjs_js_Object__T__sjs_js_Any__V(props$2, "key", key$2)
      };
      var jsx$1 = $i_react;
      return jsx$1.createElement.apply(jsx$1, [tag, props$2].concat(children$2))
    })
  })(this));
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$: 0
}, false, "japgolly.scalajs.react.vdom.Builder$ToRawReactElement$", {
  Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$;
var $n_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$)) {
    $n_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$ = new $c_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Exports() {
  $c_O.call(this);
  this.VdomNode$1 = null;
  this.VdomElement$1 = null;
  this.ReactFragment$1 = null;
  this.ReactPortal$1 = null;
  this.HtmlTagOf$1 = null;
  this.SvgTagOf$1 = null;
  this.TagMod$1 = null;
  this.EmptyVdom$1 = null;
  this.VdomAttr$1 = null;
  this.VdomStyle$1 = null;
  this.VdomArray$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Exports.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Exports.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Exports;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Exports() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Exports.prototype = $c_Ljapgolly_scalajs_react_vdom_Exports.prototype;
$c_Ljapgolly_scalajs_react_vdom_Exports.prototype.init___ = (function() {
  this.VdomNode$1 = $m_Ljapgolly_scalajs_react_vdom_VdomNode$();
  this.VdomElement$1 = $m_Ljapgolly_scalajs_react_vdom_VdomElement$();
  this.ReactFragment$1 = $m_Ljapgolly_scalajs_react_vdom_ReactFragment$();
  this.ReactPortal$1 = $m_Ljapgolly_scalajs_react_vdom_ReactPortal$();
  this.HtmlTagOf$1 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
  this.SvgTagOf$1 = $m_Ljapgolly_scalajs_react_vdom_SvgTagOf$();
  this.TagMod$1 = $m_Ljapgolly_scalajs_react_vdom_TagMod$();
  this.EmptyVdom$1 = $m_Ljapgolly_scalajs_react_vdom_VdomNode$().empty$1;
  this.VdomAttr$1 = $m_Ljapgolly_scalajs_react_vdom_Attr$();
  this.VdomStyle$1 = $m_Ljapgolly_scalajs_react_vdom_Style$();
  this.VdomArray$1 = $m_Ljapgolly_scalajs_react_vdom_VdomArray$();
  return this
});
function $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr__$$init$__V($thiz) {
  $thiz.vdomAttrVtBoolean$2 = $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$().byImplicit__F1__F2(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(value$2) {
      var value = $uZ(value$2);
      return value
    })
  })($thiz)));
  $thiz.vdomAttrVtString$2 = $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$().string$1;
  $thiz.vdomAttrVtInt$2 = $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$().byImplicit__F1__F2(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(value$3$2) {
      var value$3 = $uI(value$3$2);
      return value$3
    })
  })($thiz)));
  $thiz.vdomAttrVtJsObject$2 = $m_Ljapgolly_scalajs_react_vdom_Attr$ValueType$().direct$1
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_ReactFragment$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_ReactFragment$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_ReactFragment$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype = $c_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype;
$c_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_ReactFragment$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_ReactFragment$: 0
}, false, "japgolly.scalajs.react.vdom.ReactFragment$", {
  Ljapgolly_scalajs_react_vdom_ReactFragment$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_ReactFragment$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_ReactFragment$;
var $n_Ljapgolly_scalajs_react_vdom_ReactFragment$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_ReactFragment$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_ReactFragment$)) {
    $n_Ljapgolly_scalajs_react_vdom_ReactFragment$ = new $c_Ljapgolly_scalajs_react_vdom_ReactFragment$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_ReactFragment$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_ReactPortal$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_ReactPortal$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_ReactPortal$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype = $c_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype;
$c_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_ReactPortal$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_ReactPortal$: 0
}, false, "japgolly.scalajs.react.vdom.ReactPortal$", {
  Ljapgolly_scalajs_react_vdom_ReactPortal$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_ReactPortal$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_ReactPortal$;
var $n_Ljapgolly_scalajs_react_vdom_ReactPortal$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_ReactPortal$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_ReactPortal$)) {
    $n_Ljapgolly_scalajs_react_vdom_ReactPortal$ = new $c_Ljapgolly_scalajs_react_vdom_ReactPortal$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_ReactPortal$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Style$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Style$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Style$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Style$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Style$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Style$.prototype = $c_Ljapgolly_scalajs_react_vdom_Style$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Style$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Style$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Style$: 0
}, false, "japgolly.scalajs.react.vdom.Style$", {
  Ljapgolly_scalajs_react_vdom_Style$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Style$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Style$;
var $n_Ljapgolly_scalajs_react_vdom_Style$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Style$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Style$)) {
    $n_Ljapgolly_scalajs_react_vdom_Style$ = new $c_Ljapgolly_scalajs_react_vdom_Style$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Style$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_TagMod$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_TagMod$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_TagMod$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_TagMod$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_TagMod$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_TagMod$.prototype = $c_Ljapgolly_scalajs_react_vdom_TagMod$.prototype;
$c_Ljapgolly_scalajs_react_vdom_TagMod$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_TagMod$ = this;
  this.empty$1 = new $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3().init___();
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_TagMod$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_TagMod$: 0
}, false, "japgolly.scalajs.react.vdom.TagMod$", {
  Ljapgolly_scalajs_react_vdom_TagMod$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_TagMod$;
var $n_Ljapgolly_scalajs_react_vdom_TagMod$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_TagMod$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_TagMod$)) {
    $n_Ljapgolly_scalajs_react_vdom_TagMod$ = new $c_Ljapgolly_scalajs_react_vdom_TagMod$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_TagMod$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomArray$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomArray$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomArray$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype.empty__Ljapgolly_scalajs_react_vdom_VdomArray = (function() {
  return new $c_Ljapgolly_scalajs_react_vdom_VdomArray().init___sjs_js_Array([])
});
var $d_Ljapgolly_scalajs_react_vdom_VdomArray$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomArray$: 0
}, false, "japgolly.scalajs.react.vdom.VdomArray$", {
  Ljapgolly_scalajs_react_vdom_VdomArray$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomArray$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomArray$;
var $n_Ljapgolly_scalajs_react_vdom_VdomArray$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_VdomArray$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_VdomArray$)) {
    $n_Ljapgolly_scalajs_react_vdom_VdomArray$ = new $c_Ljapgolly_scalajs_react_vdom_VdomArray$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_VdomArray$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomElement$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomElement$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomElement$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_VdomElement$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomElement$: 0
}, false, "japgolly.scalajs.react.vdom.VdomElement$", {
  Ljapgolly_scalajs_react_vdom_VdomElement$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomElement$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomElement$;
var $n_Ljapgolly_scalajs_react_vdom_VdomElement$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_VdomElement$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_VdomElement$)) {
    $n_Ljapgolly_scalajs_react_vdom_VdomElement$ = new $c_Ljapgolly_scalajs_react_vdom_VdomElement$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_VdomElement$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomNode$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomNode$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomNode$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_VdomNode$ = this;
  this.empty$1 = new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(null);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_VdomNode$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomNode$: 0
}, false, "japgolly.scalajs.react.vdom.VdomNode$", {
  Ljapgolly_scalajs_react_vdom_VdomNode$: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomNode$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomNode$;
var $n_Ljapgolly_scalajs_react_vdom_VdomNode$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_VdomNode$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_VdomNode$)) {
    $n_Ljapgolly_scalajs_react_vdom_VdomNode$ = new $c_Ljapgolly_scalajs_react_vdom_VdomNode$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_VdomNode$
}
function $is_Ljava_io_Closeable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_Closeable)))
}
function $as_Ljava_io_Closeable(obj) {
  return (($is_Ljava_io_Closeable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.Closeable"))
}
function $isArrayOf_Ljava_io_Closeable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_Closeable)))
}
function $asArrayOf_Ljava_io_Closeable(obj, depth) {
  return (($isArrayOf_Ljava_io_Closeable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.Closeable;", depth))
}
/** @constructor */
function $c_Lorg_rebeam_Main$() {
  $c_O.call(this);
  this.MainView$1 = null;
  this.bitmap$init$0$1 = false
}
$c_Lorg_rebeam_Main$.prototype = new $h_O();
$c_Lorg_rebeam_Main$.prototype.constructor = $c_Lorg_rebeam_Main$;
/** @constructor */
function $h_Lorg_rebeam_Main$() {
  /*<skip>*/
}
$h_Lorg_rebeam_Main$.prototype = $c_Lorg_rebeam_Main$.prototype;
$c_Lorg_rebeam_Main$.prototype.init___ = (function() {
  $n_Lorg_rebeam_Main$ = this;
  $m_Ljapgolly_scalajs_react_component_builder_Builder$();
  $m_Ljapgolly_scalajs_react_package$();
  var b = new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1().init___T("MainView");
  this.MainView$1 = ($m_Ljapgolly_scalajs_react_component_builder_Builder$(), b.stateless__Ljapgolly_scalajs_react_component_builder_Builder$Step2()).noBackend__Ljapgolly_scalajs_react_component_builder_Builder$Step3().render$undP__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
    return (function(name$2) {
      var name = $as_T(name$2);
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var jsx$1 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var array = [($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), $m_Ljapgolly_scalajs_react_vdom_VdomNode$(), new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar("Hello ")), ($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), $m_Ljapgolly_scalajs_react_vdom_VdomNode$(), new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(name))];
      var a = jsx$1.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf("div", new $c_sjs_js_WrappedArray().init___sjs_js_Array(array));
      return a.render__Ljapgolly_scalajs_react_vdom_VdomElement()
    })
  })(this))).build__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)));
  this.bitmap$init$0$1 = true;
  return this
});
$c_Lorg_rebeam_Main$.prototype.main__V = (function() {
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("Hi from scala!\n");
  var theme = $m_Lorg_rebeam_mui_styles_Styles$().createMuiTheme__sjs_js_Object__sjs_js_Object({
    "palette": {}
  });
  $m_Lorg_rebeam_mui_MuiThemeProvider$();
  var x$2 = (void 0);
  $m_Lorg_rebeam_mui_MuiThemeProvider$();
  var x$3 = (void 0);
  $m_Lorg_rebeam_mui_MuiThemeProvider$();
  var x$4 = (void 0);
  $m_Lorg_rebeam_mui_MuiThemeProvider$();
  var x$5 = (void 0);
  $m_Lorg_rebeam_mui_MuiThemeProvider$();
  var x$6 = (void 0);
  var jsx$6 = $m_sc_Seq$();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var jsx$5 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var jsx$4 = ($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), new $c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle().init___T("margin")).$$colon$eq__O__F2__Ljapgolly_scalajs_react_vdom_TagMod("20px", $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$().vdomAttrVtString$2);
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var c = $m_Lorg_rebeam_MultiSelectDemo$().component__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$12 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  var props = new $c_Lorg_rebeam_MultiSelectDemo$Props().init___sci_List($m_Lorg_rebeam_MultiSelectDemo$().countries__sci_List());
  var u = $as_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(this$12.construct$2.apply__O__O__O(props, this$12.mods$2));
  var jsx$3 = u.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var c$1 = $m_Lorg_rebeam_TextFieldDemo$().ctor__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var u$1 = $as_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot($as_Ljapgolly_scalajs_react_CtorType$Nullary(c$1.ctor__Ljapgolly_scalajs_react_CtorType()).apply__O());
  var jsx$2 = u$1.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  $m_Lorg_rebeam_mui_Card$();
  var x$10 = (void 0);
  $m_Lorg_rebeam_mui_Card$();
  var x$11 = (void 0);
  $m_Lorg_rebeam_mui_Card$();
  var x$12 = (void 0);
  $m_Lorg_rebeam_mui_Card$();
  var x$13 = (void 0);
  $m_Lorg_rebeam_mui_Card$();
  var x$14 = (void 0);
  $m_Lorg_rebeam_mui_Card$();
  var x$15 = (void 0);
  var u$2 = $m_Lorg_rebeam_mui_Card$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$10, x$11, "div", 1.0, x$12, true, x$13, x$14, x$15);
  var this$34 = u$2.vdomElement$1;
  var jsx$1 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var array = [($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), $m_Ljapgolly_scalajs_react_vdom_VdomNode$(), new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar("Hi!"))];
  var array$1 = [jsx$1.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf("span", new $c_sjs_js_WrappedArray().init___sjs_js_Array(array))];
  $m_s_package$();
  var this$36 = new $c_sci_VectorBuilder().init___();
  var this$37 = this$36.$$plus$eq__O__sci_VectorBuilder(this$34);
  var i = 0;
  var len = $uI(array$1.length);
  while ((i < len)) {
    var index = i;
    var arg1 = array$1[index];
    this$37.$$plus$eq__O__sci_VectorBuilder(arg1);
    i = ((1 + i) | 0)
  };
  var array$2 = [jsx$4, jsx$3, jsx$2, new $c_Ljapgolly_scalajs_react_vdom_TagMod$Composite().init___sci_Vector(this$37.result__sci_Vector())];
  var a = jsx$5.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf("div", new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$2));
  var array$3 = [a.render__Ljapgolly_scalajs_react_vdom_VdomElement()];
  var x$16 = $as_sc_Seq(jsx$6.apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$3)));
  var qual$1 = $m_Lorg_rebeam_mui_MuiThemeProvider$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_Any__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(x$2, x$3, x$4, x$5, theme, x$6, x$16);
  var a$1 = $m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().getElementById("app");
  var x$18 = $m_Ljapgolly_scalajs_react_Callback$().empty$1;
  $f_Ljapgolly_scalajs_react_component_Generic$UnmountedSimple__renderIntoDOM__sjs_js_$bar__F0__O(qual$1, a$1, x$18)
});
$c_Lorg_rebeam_Main$.prototype.$$js$exported$meth$main__O = (function() {
  this.main__V()
});
$c_Lorg_rebeam_Main$.prototype.main = (function() {
  return this.$$js$exported$meth$main__O()
});
var $d_Lorg_rebeam_Main$ = new $TypeData().initClass({
  Lorg_rebeam_Main$: 0
}, false, "org.rebeam.Main$", {
  Lorg_rebeam_Main$: 1,
  O: 1
});
$c_Lorg_rebeam_Main$.prototype.$classData = $d_Lorg_rebeam_Main$;
var $n_Lorg_rebeam_Main$ = (void 0);
function $m_Lorg_rebeam_Main$() {
  if ((!$n_Lorg_rebeam_Main$)) {
    $n_Lorg_rebeam_Main$ = new $c_Lorg_rebeam_Main$().init___()
  };
  return $n_Lorg_rebeam_Main$
}
/** @constructor */
function $c_Lorg_rebeam_MultiSelect$() {
  $c_O.call(this);
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_MultiSelect$.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelect$.prototype.constructor = $c_Lorg_rebeam_MultiSelect$;
/** @constructor */
function $h_Lorg_rebeam_MultiSelect$() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelect$.prototype = $c_Lorg_rebeam_MultiSelect$.prototype;
$c_Lorg_rebeam_MultiSelect$.prototype.init___ = (function() {
  return this
});
$c_Lorg_rebeam_MultiSelect$.prototype.component__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  var this$7 = ($m_Ljapgolly_scalajs_react_package$(), new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1().init___T("DownshiftDemo")).initialState__F0__Ljapgolly_scalajs_react_component_builder_Builder$Step2(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return new $c_Lorg_rebeam_MultiSelect$State().init___T("")
    })
  })(this))).backend__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step3(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(x$5$2) {
      var x$5 = $as_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$5$2);
      return new $c_Lorg_rebeam_MultiSelect$Backend().init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$5)
    })
  })(this)));
  var r = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$3) {
    return (function(s$2) {
      var s = $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(s$2).raw$1;
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var this$4 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var jsx$2 = $as_Lorg_rebeam_MultiSelect$Backend($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__backend__O(this$4));
      var jsx$1 = $as_Lorg_rebeam_MultiSelect$Props($m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O(s));
      var this$5 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var a = jsx$2.render__Lorg_rebeam_MultiSelect$Props__Lorg_rebeam_MultiSelect$State__Ljapgolly_scalajs_react_vdom_TagOf(jsx$1, $as_Lorg_rebeam_MultiSelect$State($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$5).state__O()));
      return a.render__Ljapgolly_scalajs_react_vdom_VdomElement()
    })
  })(this));
  return this$7.renderWith__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4(r).build__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)))
});
var $d_Lorg_rebeam_MultiSelect$ = new $TypeData().initClass({
  Lorg_rebeam_MultiSelect$: 0
}, false, "org.rebeam.MultiSelect$", {
  Lorg_rebeam_MultiSelect$: 1,
  O: 1
});
$c_Lorg_rebeam_MultiSelect$.prototype.$classData = $d_Lorg_rebeam_MultiSelect$;
var $n_Lorg_rebeam_MultiSelect$ = (void 0);
function $m_Lorg_rebeam_MultiSelect$() {
  if ((!$n_Lorg_rebeam_MultiSelect$)) {
    $n_Lorg_rebeam_MultiSelect$ = new $c_Lorg_rebeam_MultiSelect$().init___()
  };
  return $n_Lorg_rebeam_MultiSelect$
}
/** @constructor */
function $c_Lorg_rebeam_MultiSelect$Backend() {
  $c_O.call(this);
  this.scope$1 = null;
  this.handleChange$1 = null;
  this.handleInputValueChange$1 = null;
  this.handleKeyDown$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_MultiSelect$Backend.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelect$Backend.prototype.constructor = $c_Lorg_rebeam_MultiSelect$Backend;
/** @constructor */
function $h_Lorg_rebeam_MultiSelect$Backend() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelect$Backend.prototype = $c_Lorg_rebeam_MultiSelect$Backend.prototype;
$c_Lorg_rebeam_MultiSelect$Backend.prototype.handleChange__p1__F2 = (function() {
  if (((((1 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui-extra\\js\\src\\main\\scala\\org\\rebeam\\MultiSelect.scala: 70")
  };
  return this.handleChange$1
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.handleDelete__p1__O__F0 = (function(item) {
  return $m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo(this.scope$1.props__O()).japgolly$scalajs$react$CallbackTo$$f$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, item$1) {
    return (function(p$2) {
      var p = $as_Lorg_rebeam_MultiSelect$Props(p$2);
      var jsx$3 = $m_Ljapgolly_scalajs_react_CallbackTo$();
      var this$1 = p.selectedItems$1;
      if ($f_sc_LinearSeqOptimized__contains__O__Z(this$1, item$1)) {
        var jsx$2 = p.onSelectionChange$1;
        var this$2 = p.selectedItems$1;
        $m_sci_List$();
        var b = new $c_scm_ListBuffer().init___();
        var these = this$2;
        while ((!these.isEmpty__Z())) {
          var arg1 = these.head__O();
          if (((!$m_sr_BoxesRunTime$().equals__O__O__Z(arg1, item$1)) !== false)) {
            b.$$plus$eq__O__scm_ListBuffer(arg1)
          };
          var this$4 = these;
          these = this$4.tail__sci_List()
        };
        var jsx$1 = $as_Ljapgolly_scalajs_react_CallbackTo(jsx$2.apply__O__O(b.toList__sci_List())).japgolly$scalajs$react$CallbackTo$$f$1
      } else {
        var jsx$1 = $m_Ljapgolly_scalajs_react_Callback$().empty$1
      };
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(jsx$3.map$extension__F0__F1__Ljapgolly_scalajs_react_CallbackTo$MapGuard__F0(jsx$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
        return (function(_$2) {
          $asUnit(_$2)
        })
      })($this)), null))
    })
  })(this, item)))
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.handleInputValueChange__p1__F2 = (function() {
  if (((((2 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui-extra\\js\\src\\main\\scala\\org\\rebeam\\MultiSelect.scala: 90")
  };
  return this.handleInputValueChange$1
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.render__Lorg_rebeam_MultiSelect$Props__Lorg_rebeam_MultiSelect$State__Ljapgolly_scalajs_react_vdom_TagOf = (function(props, state) {
  var jsx$10 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var jsx$9 = ($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), new $c_Ljapgolly_scalajs_react_vdom_Style().init___T("flexGrow")).$$colon$eq__O__F2__Ljapgolly_scalajs_react_vdom_TagMod("1", $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$().vdomAttrVtString$2);
  var jsx$8 = $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$().$$up$3.position__Ljapgolly_scalajs_react_vdom_HtmlStyles$position$().$$colon$eq__O__F2__Ljapgolly_scalajs_react_vdom_TagMod("relative", $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$().vdomAttrVtString$2);
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var x$6 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, props$1) {
    return (function(a$2) {
      return $as_T(props$1.itemToString$1.apply__O__O(a$2))
    })
  })(this, props));
  var x$7 = this.handleChange__p1__F2();
  var x$8 = state.inputValue$1;
  var x$9 = this.handleInputValueChange__p1__F2();
  var x$10 = $m_s_None$();
  var x$105 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, props$2) {
    return (function(a$3$2) {
      var a$3 = $as_Lorg_rebeam_downshift_Downshift$RenderState(a$3$2);
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var this$5 = props$2.selectedItems$1;
      var this$4 = $m_sci_List$();
      var bf = this$4.ReusableCBFInstance$2;
      var as = $as_sc_TraversableOnce($f_sc_IterableLike__zipWithIndex__scg_CanBuildFrom__O(this$5, bf));
      var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, props$1$1) {
        return (function(x0$1$2) {
          var x0$1 = $as_T2(x0$1$2);
          if ((x0$1 !== null)) {
            var item = x0$1.$$und1$f;
            var index = $uI(x0$1.$$und2$f);
            $as_T(props$1$1.itemToString$1.apply__O__O(item));
            $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
            var value = props$1$1.itemToKey$1.apply__O__O__O(item, index);
            $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
            var v = $as_T(props$1$1.itemToString$1.apply__O__O(item));
            $m_Ljapgolly_scalajs_react_vdom_VdomNode$();
            var value$1 = new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(v);
            var value$2 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($this$1.handleDelete__p1__O__F0(item));
            var array = [new $c_T2().init___O__O("margin", "3px 6px 3px 0px")];
            var fields = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
            var value$3 = new $c_Lorg_rebeam_mui_styles_Style().init___sjs_js_Object($m_sjs_js_Dictionary$().apply__sc_Seq__sjs_js_Dictionary(fields));
            $m_Lorg_rebeam_mui_Chip$();
            var x$16 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$17 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$18 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$19 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$20 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$21 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$22 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$23 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$24 = (void 0);
            $m_Lorg_rebeam_mui_Chip$();
            var x$25 = (void 0);
            var u = $m_Lorg_rebeam_mui_Chip$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$16, x$17, x$18, x$19, x$20, x$21, x$22, value, value$1, x$23, value$2, x$24, value$3, (-1), x$25);
            return u.vdomElement$1
          } else {
            throw new $c_s_MatchError().init___O(x0$1)
          }
        })
      })(this$2$1, props$2));
      var chips = $m_Ljapgolly_scalajs_react_vdom_VdomArray$().empty__Ljapgolly_scalajs_react_vdom_VdomArray().$$plus$plus$eq__sc_TraversableOnce__F1__Ljapgolly_scalajs_react_vdom_VdomArray(as, f).rawNode$1;
      var openAndHighlightFirst = (function(arg$outer, a$1) {
        return (function() {
          arg$outer.org$rebeam$MultiSelect$Backend$$$anonfun$render$4__Lorg_rebeam_downshift_Downshift$RenderState__V(a$1)
        })
      })(this$2$1, a$3);
      var this$32 = props$2.items$1;
      $m_sci_List$();
      var b = new $c_scm_ListBuffer().init___();
      var these = this$32;
      while ((!these.isEmpty__Z())) {
        var arg1 = these.head__O();
        var this$34 = props$2.selectedItems$1;
        if ((!$f_sc_LinearSeqOptimized__contains__O__Z(this$34, arg1))) {
          var thiz = $as_T(props$2.itemToString$1.apply__O__O(arg1));
          var thiz$2 = $as_T(thiz.toLowerCase());
          var thiz$1 = a$3.inputValue$1;
          var s = $as_T(thiz$1.toLowerCase());
          var jsx$1 = ($uI(thiz$2.indexOf(s)) !== (-1))
        } else {
          var jsx$1 = false
        };
        if ((jsx$1 !== false)) {
          b.$$plus$eq__O__scm_ListBuffer(arg1)
        };
        var this$40 = these;
        these = this$40.tail__sci_List()
      };
      var allSuggestions = b.toList__sci_List();
      if (($f_sc_LinearSeqOptimized__length__I(allSuggestions) > props$2.maxMenuItems$1)) {
        var _1 = allSuggestions.take__I__sci_List(props$2.maxMenuItems$1);
        var x1_$_$$und1$f = _1;
        var x1_$_$$und2$f = true
      } else {
        var x1_$_$$und1$f = allSuggestions;
        var x1_$_$$und2$f = false
      };
      var suggestions = $as_sci_List(x1_$_$$und1$f);
      var overflow = $uZ(x1_$_$$und2$f);
      var this$41 = $m_sci_List$();
      var bf$1 = this$41.ReusableCBFInstance$2;
      var this$43 = $as_sci_List($f_sc_IterableLike__zipWithIndex__scg_CanBuildFrom__O(suggestions, bf$1));
      var f$1 = (function(this$3$1, props$1$2, a) {
        return (function(x0$2$2) {
          var x0$2 = $as_T2(x0$2$2);
          if ((x0$2 !== null)) {
            var item$1 = x0$2.$$und1$f;
            var index$1 = $uI(x0$2.$$und2$f);
            return this$3$1.renderItem__T__I__sjs_js_Object__s_Option__Ljapgolly_scalajs_react_vdom_VdomElement($as_T(props$1$2.itemToString$1.apply__O__O(item$1)), index$1, a.getItemProps$1.apply__O__O(new $c_Lorg_rebeam_downshift_Downshift$ItemData().init___O__I__Z(item$1, index$1, false)), a.highlightedIndex$1)
          } else {
            throw new $c_s_MatchError().init___O(x0$2)
          }
        })
      })(this$2$1, props$2, a$3);
      var this$42 = $m_sci_List$();
      var bf$2 = this$42.ReusableCBFInstance$2;
      if ((bf$2 === $m_sci_List$().ReusableCBFInstance$2)) {
        if ((this$43 === $m_sci_Nil$())) {
          var jsx$2 = $m_sci_Nil$()
        } else {
          var arg1$1 = this$43.head__O();
          var h = new $c_sci_$colon$colon().init___O__sci_List(f$1(arg1$1), $m_sci_Nil$());
          var t = h;
          var rest = this$43.tail__sci_List();
          while ((rest !== $m_sci_Nil$())) {
            var arg1$2 = rest.head__O();
            var nx = new $c_sci_$colon$colon().init___O__sci_List(f$1(arg1$2), $m_sci_Nil$());
            t.tl$5 = nx;
            t = nx;
            var this$44 = rest;
            rest = this$44.tail__sci_List()
          };
          var jsx$2 = h
        }
      } else {
        var b$1 = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder(this$43, bf$2);
        var these$1 = this$43;
        while ((!these$1.isEmpty__Z())) {
          var arg1$3 = these$1.head__O();
          b$1.$$plus$eq__O__scm_Builder(f$1(arg1$3));
          var this$45 = these$1;
          these$1 = this$45.tail__sci_List()
        };
        var jsx$2 = b$1.result__O()
      };
      var menuItems = $as_sci_List(jsx$2);
      if (menuItems.isEmpty__Z()) {
        $m_sci_List$();
        $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$31 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$32 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$33 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$34 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$35 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$36 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$37 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$38 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$39 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$40 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$41 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$42 = (void 0);
        var jsx$3 = $m_sc_Seq$();
        $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
        var v$1 = props$2.nothingFound$1;
        $m_Ljapgolly_scalajs_react_vdom_VdomNode$();
        var array$1 = [new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(v$1)];
        var x$43 = $as_sc_Seq(jsx$3.apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$1)));
        var u$1 = $m_Lorg_rebeam_mui_MenuItem$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$31, x$32, false, x$33, x$34, "div", x$35, x$36, true, x$37, x$38, "org.rebeam.MultiSelect.ellipsis", x$39, x$40, false, x$41, x$42, x$43);
        var array$2 = [u$1.vdomElement$1];
        var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$2);
        var this$72 = $m_sci_List$();
        var cbf = this$72.ReusableCBFInstance$2;
        var menuContents = $as_sci_List($f_sc_TraversableLike__to__scg_CanBuildFrom__O(xs, cbf))
      } else if (overflow) {
        $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$49 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$50 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$51 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$52 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$53 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$54 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$55 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$56 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$57 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$58 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$59 = (void 0);
        $m_Lorg_rebeam_mui_MenuItem$();
        var x$60 = (void 0);
        var jsx$4 = $m_sc_Seq$();
        $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
        var v$2 = props$2.moreAvailable$1;
        $m_Ljapgolly_scalajs_react_vdom_VdomNode$();
        var array$3 = [new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(v$2)];
        var x$61 = $as_sc_Seq(jsx$4.apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$3)));
        var u$2 = $m_Lorg_rebeam_mui_MenuItem$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$49, x$50, false, x$51, x$52, "div", x$53, x$54, true, x$55, x$56, "org.rebeam.MultiSelect.ellipsis", x$57, x$58, false, x$59, x$60, x$61);
        var elem = u$2.vdomElement$1;
        var this$96 = $m_sci_List$();
        var bf$3 = this$96.ReusableCBFInstance$2;
        var menuContents = $as_sci_List($f_sc_SeqLike__$$colon$plus__O__scg_CanBuildFrom__O(menuItems, elem, bf$3))
      } else {
        var menuContents = menuItems
      };
      var jsx$5 = a$3.getInputProps$1;
      var s$1 = props$2.placeholder$1;
      var inputProps = jsx$5.apply__O__O({
        "placeholder": s$1,
        "startAdornment": chips,
        "onKeyDown": this$2$1.handleKeyDown__p1__sjs_js_Function1(),
        "onFocus": openAndHighlightFirst,
        "style": {
          "flexWrap": "wrap"
        },
        "inputProps": {
          "style": {
            "paddingTop": "10px",
            "paddingBottom": "12px"
          }
        }
      });
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var jsx$7 = $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$();
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      $m_Lorg_rebeam_mui_TextField$();
      var x$64 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$65 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$66 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$67 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$68 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$69 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$70 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$71 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$72 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$73 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$74 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$75 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$76 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$77 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$78 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$79 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$80 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$81 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$82 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$83 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$84 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$85 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$86 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$87 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$88 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$89 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$90 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$91 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$92 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$93 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$94 = (void 0);
      $m_Lorg_rebeam_mui_TextField$();
      var x$95 = (void 0);
      var u$3 = $m_Lorg_rebeam_mui_TextField$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$64, x$65, inputProps, x$66, x$67, x$68, x$69, x$70, x$71, x$72, x$73, x$74, true, x$75, x$76, x$77, x$78, x$79, x$80, x$81, x$82, x$83, x$84, x$85, x$86, x$87, x$88, x$89, x$90, x$91, x$92, x$93, x$94, x$95);
      var jsx$6 = u$3.vdomElement$1;
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var array$4 = [new $c_T2().init___O__O("position", "absolute"), new $c_T2().init___O__O("zIndex", "1"), new $c_T2().init___O__O("marginTop", "4px"), new $c_T2().init___O__O("left", "0"), new $c_T2().init___O__O("right", "0")];
      var fields$1 = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$4);
      var value$4 = new $c_Lorg_rebeam_mui_styles_Style().init___sjs_js_Object($m_sjs_js_Dictionary$().apply__sc_Seq__sjs_js_Dictionary(fields$1));
      $m_Lorg_rebeam_mui_Paper$();
      var x$98 = (void 0);
      $m_Lorg_rebeam_mui_Paper$();
      var x$99 = (void 0);
      $m_Lorg_rebeam_mui_Paper$();
      var x$100 = (void 0);
      $m_Lorg_rebeam_mui_Paper$();
      var x$101 = (void 0);
      $m_Lorg_rebeam_mui_Paper$();
      var x$102 = (void 0);
      $m_Lorg_rebeam_mui_Paper$();
      var x$103 = (void 0);
      var u$4 = $m_Lorg_rebeam_mui_Paper$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$98, x$99, x$100, x$101, x$102, true, value$4, x$103, menuContents);
      var this$159 = u$4.vdomElement$1;
      var condition = a$3.isOpen$1;
      var array$5 = [jsx$6, $f_Ljapgolly_scalajs_react_vdom_TagMod__when__Z__Ljapgolly_scalajs_react_vdom_TagMod(this$159, condition)];
      var a$4 = jsx$7.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf("div", new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$5));
      return a$4.render__Ljapgolly_scalajs_react_vdom_VdomElement()
    })
  })(this, props));
  var u$5 = $m_Lorg_rebeam_downshift_Downshift$().apply__F1__s_Option__F2__T__F2__F1__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$6, x$10, x$7, x$8, x$9, x$105);
  var array$6 = [jsx$9, jsx$8, u$5.vdomElement$1];
  return jsx$10.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf("div", new $c_sjs_js_WrappedArray().init___sjs_js_Array(array$6))
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.renderItem__T__I__sjs_js_Object__s_Option__Ljapgolly_scalajs_react_vdom_VdomElement = (function(itemAsString, index, itemProps, highlightedIndex) {
  $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
  var value = highlightedIndex.contains__O__Z(index);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$110 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$111 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$112 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$113 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$114 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$115 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$116 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$117 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$118 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$119 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$120 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$121 = (void 0);
  $m_Lorg_rebeam_mui_MenuItem$();
  var x$122 = (void 0);
  var jsx$1 = $m_sc_Seq$();
  var array = [($m_Ljapgolly_scalajs_react_vdom_html$und$less$up$(), $m_Ljapgolly_scalajs_react_vdom_VdomNode$(), new $c_Ljapgolly_scalajs_react_vdom_VdomNode().init___sjs_js_$bar(itemAsString))];
  var x$123 = $as_sc_Seq(jsx$1.apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array(array)));
  var u = $m_Lorg_rebeam_mui_MenuItem$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$110, x$111, x$112, x$113, x$114, "div", x$115, x$116, x$117, x$118, x$119, itemAsString, x$120, x$121, value, x$122, itemProps, x$123);
  return u.vdomElement$1
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.handleKeyDown__p1__sjs_js_Function1 = (function() {
  if (((((4 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui-extra\\js\\src\\main\\scala\\org\\rebeam\\MultiSelect.scala: 103")
  };
  return this.handleKeyDown$1
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.org$rebeam$MultiSelect$Backend$$$anonfun$render$4__Lorg_rebeam_downshift_Downshift$RenderState__V = (function(a$1) {
  (0, a$1.openMenu$1)();
  (0, a$1.setHighlightedIndex$1)(0)
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.org$rebeam$MultiSelect$Backend$$$anonfun$handleKeyDown$1__Ljapgolly_scalajs_react_raw_SyntheticKeyboardEvent__V = (function(e) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(this.scope$1.props__O()).japgolly$scalajs$react$CallbackTo$$f$1;
  var arg1 = $$this.apply__O();
  var p = $as_Lorg_rebeam_MultiSelect$Props(arg1);
  new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo(this.scope$1.state__O()).japgolly$scalajs$react$CallbackTo$$f$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, e$1, p$1) {
    return (function(s$2) {
      var s = $as_Lorg_rebeam_MultiSelect$State(s$2);
      var jsx$4 = $m_Ljapgolly_scalajs_react_CallbackTo$();
      var thiz = $as_T(e$1.key);
      if (($as_T(thiz.toLowerCase()) === "backspace")) {
        var thiz$1 = s.inputValue$1;
        if ((thiz$1 === null)) {
          throw new $c_jl_NullPointerException().init___()
        };
        var jsx$2 = (thiz$1 === "")
      } else {
        var jsx$2 = false
      };
      if (jsx$2) {
        var jsx$3 = p$1.onSelectionChange$1;
        var this$5 = p$1.selectedItems$1;
        var jsx$1 = $as_Ljapgolly_scalajs_react_CallbackTo(jsx$3.apply__O__O($f_sc_LinearSeqOptimized__dropRight__I__sc_LinearSeqOptimized(this$5, 1))).japgolly$scalajs$react$CallbackTo$$f$1
      } else {
        var jsx$1 = $m_Ljapgolly_scalajs_react_Callback$().empty$1
      };
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(jsx$4.map$extension__F0__F1__Ljapgolly_scalajs_react_CallbackTo$MapGuard__F0(jsx$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1) {
        return (function(_$2) {
          $asUnit(_$2)
        })
      })($this)), null))
    })
  })(this, e, p)))).japgolly$scalajs$react$CallbackTo$$f$1.apply__O()
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(scope) {
  this.scope$1 = scope;
  this.handleChange$1 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(item$2, c$2) {
      var item = $as_s_Option(item$2);
      var c = $as_Lorg_rebeam_downshift_Downshift$RenderState(c$2);
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_CallbackTo$().flatMap$extension__F0__F1__F0($as_Ljapgolly_scalajs_react_CallbackTo($this.scope$1.props__O()).japgolly$scalajs$react$CallbackTo$$f$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, item$1, c$1) {
        return (function(p$2) {
          var p = $as_Lorg_rebeam_MultiSelect$Props(p$2);
          var jsx$4 = $m_Ljapgolly_scalajs_react_CallbackTo$();
          if (item$1.isEmpty__Z()) {
            var jsx$1 = true
          } else {
            var arg1 = item$1.get__O();
            var this$1 = p.selectedItems$1;
            var jsx$1 = (!$f_sc_LinearSeqOptimized__contains__O__Z(this$1, arg1))
          };
          if (jsx$1) {
            var this$2 = item$1
          } else {
            var this$2 = $m_s_None$()
          };
          if (this$2.isEmpty__Z()) {
            var jsx$2 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_Callback$().empty$1)
          } else {
            var arg1$1 = this$2.get__O();
            var jsx$3 = p.onSelectionChange$1;
            var this$4 = p.selectedItems$1;
            var this$3 = $m_sci_List$();
            var bf = this$3.ReusableCBFInstance$2;
            var jsx$2 = new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(jsx$3.apply__O__O($f_sc_SeqLike__$$colon$plus__O__scg_CanBuildFrom__O(this$4, arg1$1, bf))).japgolly$scalajs$react$CallbackTo$$f$1)
          };
          return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(jsx$4.flatMap$extension__F0__F1__F0(jsx$2.japgolly$scalajs$react$CallbackTo$$f$1, new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$4$1, c$1$1) {
            return (function(_$2) {
              $asUnit(_$2);
              return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($m_Ljapgolly_scalajs_react_CallbackTo$().map$extension__F0__F1__Ljapgolly_scalajs_react_CallbackTo$MapGuard__F0($m_Ljapgolly_scalajs_react_Callback$().apply__F0__Ljapgolly_scalajs_react_Callback$ResultGuard__F0(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this$2, c$1$2) {
                return (function() {
                  (0, c$1$2.openMenu$1)();
                  (0, c$1$2.setHighlightedIndex$1)(0)
                })
              })(this$4$1, c$1$1)), null), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1) {
                return (function(_$2$2) {
                  $asUnit(_$2$2)
                })
              })(this$4$1)), null))
            })
          })($this$1, c$1))))
        })
      })($this, item, c))))
    })
  })(this));
  this.bitmap$init$0$1 = (((1 | this.bitmap$init$0$1) << 24) >> 24);
  this.handleInputValueChange$1 = new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function(this$2$2) {
    return (function(value$2, c$3$2) {
      var value = $as_T(value$2);
      $as_Lorg_rebeam_downshift_Downshift$RenderState(c$3$2);
      var this$5 = this$2$2.scope$1;
      var mod = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$3, value$1) {
        return (function(x$2$2) {
          $as_Lorg_rebeam_MultiSelect$State(x$2$2);
          return new $c_Lorg_rebeam_MultiSelect$State().init___T(value$1)
        })
      })(this$2$2, value));
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(this$5.modState__F1__F0__O(mod, $m_Ljapgolly_scalajs_react_Callback$().empty$1)).japgolly$scalajs$react$CallbackTo$$f$1)
    })
  })(this));
  this.bitmap$init$0$1 = (((2 | this.bitmap$init$0$1) << 24) >> 24);
  this.handleKeyDown$1 = (function(arg$outer) {
    return (function(arg1$2) {
      arg$outer.org$rebeam$MultiSelect$Backend$$$anonfun$handleKeyDown$1__Ljapgolly_scalajs_react_raw_SyntheticKeyboardEvent__V(arg1$2)
    })
  })(this);
  this.bitmap$init$0$1 = (((4 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
function $is_Lorg_rebeam_MultiSelect$Backend(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelect$Backend)))
}
function $as_Lorg_rebeam_MultiSelect$Backend(obj) {
  return (($is_Lorg_rebeam_MultiSelect$Backend(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelect$Backend"))
}
function $isArrayOf_Lorg_rebeam_MultiSelect$Backend(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelect$Backend)))
}
function $asArrayOf_Lorg_rebeam_MultiSelect$Backend(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelect$Backend(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelect$Backend;", depth))
}
var $d_Lorg_rebeam_MultiSelect$Backend = new $TypeData().initClass({
  Lorg_rebeam_MultiSelect$Backend: 0
}, false, "org.rebeam.MultiSelect$Backend", {
  Lorg_rebeam_MultiSelect$Backend: 1,
  O: 1
});
$c_Lorg_rebeam_MultiSelect$Backend.prototype.$classData = $d_Lorg_rebeam_MultiSelect$Backend;
/** @constructor */
function $c_Lorg_rebeam_MultiSelectDemo$() {
  $c_O.call(this);
  this.MultiSelectCountry$1 = null;
  this.countries$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_MultiSelectDemo$.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelectDemo$.prototype.constructor = $c_Lorg_rebeam_MultiSelectDemo$;
/** @constructor */
function $h_Lorg_rebeam_MultiSelectDemo$() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelectDemo$.prototype = $c_Lorg_rebeam_MultiSelectDemo$.prototype;
$c_Lorg_rebeam_MultiSelectDemo$.prototype.init___ = (function() {
  $n_Lorg_rebeam_MultiSelectDemo$ = this;
  this.MultiSelectCountry$1 = $m_Lorg_rebeam_MultiSelect$().component__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  this.bitmap$init$0$1 = (((1 | this.bitmap$init$0$1) << 24) >> 24);
  $m_sci_List$();
  var array = [new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Afghanistan", "AF"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Aland Islands", "AX"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Albania", "AL"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Algeria", "DZ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("American Samoa", "AS"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Andorra", "AD"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Angola", "AO"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Anguilla", "AI"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Antarctica", "AQ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Antigua and Barbuda", "AG"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Argentina", "AR"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Armenia", "AM"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Aruba", "AW"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Australia", "AU"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Austria", "AT"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Azerbaijan", "AZ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bahrain", "BH"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bahamas", "BS"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bangladesh", "BD"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Barbados", "BB"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Belarus", "BY"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Belgium", "BE"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Belize", "BZ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Benin", "BJ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bermuda", "BM"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bhutan", "BT"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bolivia, Plurinational State of", "BO"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bonaire, Sint Eustatius and Saba", "BQ"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bosnia and Herzegovina", "BA"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Botswana", "BW"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bouvet Island", "BV"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Brazil", "BR"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("British Indian Ocean Territory", "IO"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Brunei Darussalam", "BN"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Bulgaria", "BG"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Burkina Faso", "BF"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Burundi", "BI"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Cambodia", "KH"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Cameroon", "CM"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Canada", "CA"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Cape Verde", "CV"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Cayman Islands", "KY"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Central African Republic", "CF"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Chad", "TD"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("Chile", "CL"), new $c_Lorg_rebeam_MultiSelectDemo$Country().init___T__T("China", "CN")];
  var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
  var this$4 = $m_sci_List$();
  var cbf = this$4.ReusableCBFInstance$2;
  this.countries$1 = $as_sci_List($f_sc_TraversableLike__to__scg_CanBuildFrom__O(xs, cbf));
  this.bitmap$init$0$1 = (((4 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_MultiSelectDemo$.prototype.countries__sci_List = (function() {
  if (((((4 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-electron-webpack\\scala_project_root\\js\\src\\main\\scala\\org\\rebeam\\MultiSelectDemo.scala: 15")
  };
  return this.countries$1
});
$c_Lorg_rebeam_MultiSelectDemo$.prototype.MultiSelectCountry__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((1 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-electron-webpack\\scala_project_root\\js\\src\\main\\scala\\org\\rebeam\\MultiSelectDemo.scala: 11")
  };
  return this.MultiSelectCountry$1
});
$c_Lorg_rebeam_MultiSelectDemo$.prototype.component__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  var this$7 = ($m_Ljapgolly_scalajs_react_package$(), new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1().init___T("DownshiftDemo")).initialState__F0__Ljapgolly_scalajs_react_component_builder_Builder$Step2(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return new $c_Lorg_rebeam_MultiSelectDemo$State().init___sci_List($m_sci_Nil$())
    })
  })(this))).backend__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step3(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(x$2$2) {
      var x$2 = $as_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$2$2);
      return new $c_Lorg_rebeam_MultiSelectDemo$Backend().init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$2)
    })
  })(this)));
  var r = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$3) {
    return (function(s$2) {
      var s = $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(s$2).raw$1;
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var this$4 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var jsx$2 = $as_Lorg_rebeam_MultiSelectDemo$Backend($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__backend__O(this$4));
      var jsx$1 = $as_Lorg_rebeam_MultiSelectDemo$Props($m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O(s));
      var this$5 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var u = jsx$2.render__Lorg_rebeam_MultiSelectDemo$Props__Lorg_rebeam_MultiSelectDemo$State__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(jsx$1, $as_Lorg_rebeam_MultiSelectDemo$State($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$5).state__O()));
      return u.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement()
    })
  })(this));
  return this$7.renderWith__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4(r).build__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)))
});
var $d_Lorg_rebeam_MultiSelectDemo$ = new $TypeData().initClass({
  Lorg_rebeam_MultiSelectDemo$: 0
}, false, "org.rebeam.MultiSelectDemo$", {
  Lorg_rebeam_MultiSelectDemo$: 1,
  O: 1
});
$c_Lorg_rebeam_MultiSelectDemo$.prototype.$classData = $d_Lorg_rebeam_MultiSelectDemo$;
var $n_Lorg_rebeam_MultiSelectDemo$ = (void 0);
function $m_Lorg_rebeam_MultiSelectDemo$() {
  if ((!$n_Lorg_rebeam_MultiSelectDemo$)) {
    $n_Lorg_rebeam_MultiSelectDemo$ = new $c_Lorg_rebeam_MultiSelectDemo$().init___()
  };
  return $n_Lorg_rebeam_MultiSelectDemo$
}
/** @constructor */
function $c_Lorg_rebeam_MultiSelectDemo$Backend() {
  $c_O.call(this);
  this.scope$1 = null;
  this.handleSelectionChange$1 = null;
  this.bitmap$init$0$1 = false
}
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype.constructor = $c_Lorg_rebeam_MultiSelectDemo$Backend;
/** @constructor */
function $h_Lorg_rebeam_MultiSelectDemo$Backend() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelectDemo$Backend.prototype = $c_Lorg_rebeam_MultiSelectDemo$Backend.prototype;
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype.render__Lorg_rebeam_MultiSelectDemo$Props__Lorg_rebeam_MultiSelectDemo$State__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(props, state) {
  var c = $m_Lorg_rebeam_MultiSelectDemo$().MultiSelectCountry__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$2 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  var props$1 = new $c_Lorg_rebeam_MultiSelect$Props().init___sci_List__sci_List__F1__F1__F2__I__T__T__T($m_Lorg_rebeam_MultiSelectDemo$().countries__sci_List(), state.selectedItems$1, this.handleSelectionChange__p1__F1(), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(c$2) {
      var c$1 = $as_Lorg_rebeam_MultiSelectDemo$Country(c$2);
      return (((c$1.name$1 + " (") + c$1.code$1) + ")")
    })
  })(this)), $m_Lorg_rebeam_MultiSelect$Props$().apply$default$5__F2(), 5, "Nothing found...", "More items match...", "Search...");
  return $as_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(this$2.construct$2.apply__O__O__O(props$1, this$2.mods$2))
});
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype.handleSelectionChange__p1__F1 = (function() {
  if ((!this.bitmap$init$0$1)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-electron-webpack\\scala_project_root\\js\\src\\main\\scala\\org\\rebeam\\MultiSelectDemo.scala: 71")
  };
  return this.handleSelectionChange$1
});
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(scope) {
  this.scope$1 = scope;
  this.handleSelectionChange$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(newSelection$2) {
      var newSelection = $as_sci_List(newSelection$2);
      var this$1 = $this.scope$1;
      var mod = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, newSelection$1) {
        return (function(x$1$2) {
          $as_Lorg_rebeam_MultiSelectDemo$State(x$1$2);
          return new $c_Lorg_rebeam_MultiSelectDemo$State().init___sci_List(newSelection$1)
        })
      })($this, newSelection));
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0($as_Ljapgolly_scalajs_react_CallbackTo(this$1.modState__F1__F0__O(mod, $m_Ljapgolly_scalajs_react_Callback$().empty$1)).japgolly$scalajs$react$CallbackTo$$f$1)
    })
  })(this));
  this.bitmap$init$0$1 = true;
  return this
});
function $is_Lorg_rebeam_MultiSelectDemo$Backend(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelectDemo$Backend)))
}
function $as_Lorg_rebeam_MultiSelectDemo$Backend(obj) {
  return (($is_Lorg_rebeam_MultiSelectDemo$Backend(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelectDemo$Backend"))
}
function $isArrayOf_Lorg_rebeam_MultiSelectDemo$Backend(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelectDemo$Backend)))
}
function $asArrayOf_Lorg_rebeam_MultiSelectDemo$Backend(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelectDemo$Backend(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelectDemo$Backend;", depth))
}
var $d_Lorg_rebeam_MultiSelectDemo$Backend = new $TypeData().initClass({
  Lorg_rebeam_MultiSelectDemo$Backend: 0
}, false, "org.rebeam.MultiSelectDemo$Backend", {
  Lorg_rebeam_MultiSelectDemo$Backend: 1,
  O: 1
});
$c_Lorg_rebeam_MultiSelectDemo$Backend.prototype.$classData = $d_Lorg_rebeam_MultiSelectDemo$Backend;
/** @constructor */
function $c_Lorg_rebeam_TextFieldDemo$() {
  $c_O.call(this);
  this.bitmap$init$0$1 = false
}
$c_Lorg_rebeam_TextFieldDemo$.prototype = new $h_O();
$c_Lorg_rebeam_TextFieldDemo$.prototype.constructor = $c_Lorg_rebeam_TextFieldDemo$;
/** @constructor */
function $h_Lorg_rebeam_TextFieldDemo$() {
  /*<skip>*/
}
$h_Lorg_rebeam_TextFieldDemo$.prototype = $c_Lorg_rebeam_TextFieldDemo$.prototype;
$c_Lorg_rebeam_TextFieldDemo$.prototype.init___ = (function() {
  return this
});
$c_Lorg_rebeam_TextFieldDemo$.prototype.ctor__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  var this$7 = ($m_Ljapgolly_scalajs_react_package$(), new $c_Ljapgolly_scalajs_react_component_builder_Builder$Step1().init___T("TextFieldDemo")).initialState__F0__Ljapgolly_scalajs_react_component_builder_Builder$Step2(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return new $c_Lorg_rebeam_TextFieldDemo$State().init___T("")
    })
  })(this))).backend__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step3(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2) {
    return (function(x$2$2) {
      var x$2 = $as_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$2$2);
      return new $c_Lorg_rebeam_TextFieldDemo$Backend().init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(x$2)
    })
  })(this)));
  var r = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$3) {
    return (function(s$2) {
      var s = $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(s$2).raw$1;
      $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$();
      var this$4 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var jsx$2 = $as_Lorg_rebeam_TextFieldDemo$Backend($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__backend__O(this$4));
      var jsx$1 = $asUnit($m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().props$extension__Ljapgolly_scalajs_react_raw_React$Component__O(s));
      var this$5 = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope().init___Ljapgolly_scalajs_react_raw_React$Component(s);
      var u = jsx$2.render__sr_BoxedUnit__Lorg_rebeam_TextFieldDemo$State__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(jsx$1, $as_Lorg_rebeam_TextFieldDemo$State($f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this$5).state__O()));
      return u.vdomElement$1
    })
  })(this));
  return this$7.renderWith__F1__Ljapgolly_scalajs_react_component_builder_Builder$Step4(r).build__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonN__Ljapgolly_scalajs_react_internal_Singleton__Ljapgolly_scalajs_react_CtorType$Summoner($m_Ljapgolly_scalajs_react_internal_Singleton$().BoxUnit$1))
});
var $d_Lorg_rebeam_TextFieldDemo$ = new $TypeData().initClass({
  Lorg_rebeam_TextFieldDemo$: 0
}, false, "org.rebeam.TextFieldDemo$", {
  Lorg_rebeam_TextFieldDemo$: 1,
  O: 1
});
$c_Lorg_rebeam_TextFieldDemo$.prototype.$classData = $d_Lorg_rebeam_TextFieldDemo$;
var $n_Lorg_rebeam_TextFieldDemo$ = (void 0);
function $m_Lorg_rebeam_TextFieldDemo$() {
  if ((!$n_Lorg_rebeam_TextFieldDemo$)) {
    $n_Lorg_rebeam_TextFieldDemo$ = new $c_Lorg_rebeam_TextFieldDemo$().init___()
  };
  return $n_Lorg_rebeam_TextFieldDemo$
}
/** @constructor */
function $c_Lorg_rebeam_TextFieldDemo$Backend() {
  $c_O.call(this);
  this.scope$1 = null
}
$c_Lorg_rebeam_TextFieldDemo$Backend.prototype = new $h_O();
$c_Lorg_rebeam_TextFieldDemo$Backend.prototype.constructor = $c_Lorg_rebeam_TextFieldDemo$Backend;
/** @constructor */
function $h_Lorg_rebeam_TextFieldDemo$Backend() {
  /*<skip>*/
}
$h_Lorg_rebeam_TextFieldDemo$Backend.prototype = $c_Lorg_rebeam_TextFieldDemo$Backend.prototype;
$c_Lorg_rebeam_TextFieldDemo$Backend.prototype.render__sr_BoxedUnit__Lorg_rebeam_TextFieldDemo$State__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(props, state) {
  var value = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(e$2) {
      var s = $as_T(e$2.target.value);
      var jsx$1 = $m_Ljapgolly_scalajs_react_CallbackTo$();
      var this$2 = $this.scope$1;
      var mod = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, s$1) {
        return (function(x$1$2) {
          $as_Lorg_rebeam_TextFieldDemo$State(x$1$2);
          return new $c_Lorg_rebeam_TextFieldDemo$State().init___T(s$1)
        })
      })($this, s));
      return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(jsx$1.$$greater$greater$extension__F0__F0__F0($as_Ljapgolly_scalajs_react_CallbackTo(this$2.modState__F1__F0__O(mod, $m_Ljapgolly_scalajs_react_Callback$().empty$1)).japgolly$scalajs$react$CallbackTo$$f$1, $m_Ljapgolly_scalajs_react_Callback$().apply__F0__Ljapgolly_scalajs_react_Callback$ResultGuard__F0(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function(this$2$1, e) {
        return (function() {
          var x = (("Input '" + $as_T(e.target.value)) + "'");
          var this$4 = $m_s_Console$();
          var this$5 = $as_Ljava_io_PrintStream(this$4.outVar$2.v$1);
          this$5.java$lang$JSConsoleBasedPrintStream$$printString__T__V((x + "\n"))
        })
      })($this, e$2)), null)))
    })
  })(this));
  var value$1 = state.inputValue$1;
  $m_Lorg_rebeam_mui_TextField$();
  var x$6 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$7 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$8 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$9 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$10 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$11 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$12 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$13 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$14 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$15 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$16 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$17 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$18 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$19 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$20 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$21 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$22 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$23 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$24 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$25 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$26 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$27 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$28 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$29 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$30 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$31 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$32 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$33 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$34 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$35 = (void 0);
  $m_Lorg_rebeam_mui_TextField$();
  var x$36 = (void 0);
  return $m_Lorg_rebeam_mui_TextField$().apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(x$6, x$7, x$8, x$9, x$10, x$11, x$12, x$13, x$14, x$15, x$16, x$17, true, x$18, x$19, x$20, x$21, x$22, x$23, x$24, x$25, x$26, x$27, value, x$28, x$29, x$30, x$31, x$32, x$33, x$34, x$35, value$1, x$36)
});
$c_Lorg_rebeam_TextFieldDemo$Backend.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(scope) {
  this.scope$1 = scope;
  return this
});
function $is_Lorg_rebeam_TextFieldDemo$Backend(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_TextFieldDemo$Backend)))
}
function $as_Lorg_rebeam_TextFieldDemo$Backend(obj) {
  return (($is_Lorg_rebeam_TextFieldDemo$Backend(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.TextFieldDemo$Backend"))
}
function $isArrayOf_Lorg_rebeam_TextFieldDemo$Backend(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_TextFieldDemo$Backend)))
}
function $asArrayOf_Lorg_rebeam_TextFieldDemo$Backend(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_TextFieldDemo$Backend(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.TextFieldDemo$Backend;", depth))
}
var $d_Lorg_rebeam_TextFieldDemo$Backend = new $TypeData().initClass({
  Lorg_rebeam_TextFieldDemo$Backend: 0
}, false, "org.rebeam.TextFieldDemo$Backend", {
  Lorg_rebeam_TextFieldDemo$Backend: 1,
  O: 1
});
$c_Lorg_rebeam_TextFieldDemo$Backend.prototype.$classData = $d_Lorg_rebeam_TextFieldDemo$Backend;
/** @constructor */
function $c_Lorg_rebeam_downshift_Downshift$() {
  $c_O.call(this);
  this.jsFnComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_downshift_Downshift$.prototype = new $h_O();
$c_Lorg_rebeam_downshift_Downshift$.prototype.constructor = $c_Lorg_rebeam_downshift_Downshift$;
/** @constructor */
function $h_Lorg_rebeam_downshift_Downshift$() {
  /*<skip>*/
}
$h_Lorg_rebeam_downshift_Downshift$.prototype = $c_Lorg_rebeam_downshift_Downshift$.prototype;
$c_Lorg_rebeam_downshift_Downshift$.prototype.org$rebeam$downshift$Downshift$$$anonfun$apply$1__sjs_js_Any__F1__T = (function(item, itemToString$1) {
  return ((item === null) ? "" : $as_T(itemToString$1.apply__O__O(item)))
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.init___ = (function() {
  $n_Lorg_rebeam_downshift_Downshift$ = this;
  this.jsFnComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_downshift), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.downshift.Downshift.jsFnComponent"), new $c_Lsourcecode_Line().init___I(155));
  this.bitmap$init$0$1 = (((8 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.apply__F1__s_Option__F2__T__F2__F1__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(itemToString, selectedItem, onChange, inputValue, onInputValueChange, children) {
  var p = {};
  p.itemToString = (function(itemToString$1) {
    return (function(arg1$2) {
      return $m_Lorg_rebeam_downshift_Downshift$().org$rebeam$downshift$Downshift$$$anonfun$apply$1__sjs_js_Any__F1__T(arg1$2, itemToString$1)
    })
  })(itemToString);
  var value = (selectedItem.isEmpty__Z() ? null : selectedItem.get__O());
  p.selectedItem = value;
  var a = (function(onChange$1) {
    return (function(arg1$2$1, arg2$2) {
      $m_Lorg_rebeam_downshift_Downshift$().org$rebeam$downshift$Downshift$$$anonfun$apply$3__sjs_js_Any__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F2__V(arg1$2$1, arg2$2, onChange$1)
    })
  })(onChange);
  p.onChange = a;
  p.inputValue = inputValue;
  var a$1 = (function(onInputValueChange$1) {
    return (function(arg1$2$2, arg2$2$1) {
      $m_Lorg_rebeam_downshift_Downshift$().org$rebeam$downshift$Downshift$$$anonfun$apply$4__sjs_js_Any__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F2__V(arg1$2$2, arg2$2$1, onInputValueChange$1)
    })
  })(onInputValueChange);
  p.onInputValueChange = a$1;
  p.children = (function(children$1) {
    return (function(arg1$2$3) {
      return $m_Lorg_rebeam_downshift_Downshift$().org$rebeam$downshift$Downshift$$$anonfun$apply$5__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F1__Ljapgolly_scalajs_react_raw_React$Element(arg1$2$3, children$1)
    })
  })(children);
  var c = this.jsFnComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$8 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$8.construct$2.apply__O__O__O(p, this$8.mods$2))
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.option__p1__sjs_js_Any__s_Option = (function(v) {
  return ((v === null) ? $m_s_None$() : new $c_s_Some().init___O(v))
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.org$rebeam$downshift$Downshift$$$anonfun$apply$3__sjs_js_Any__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F2__V = (function(item, c, onChange$1) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(onChange$1.apply__O__O__O($m_Lorg_rebeam_downshift_Downshift$().option__p1__sjs_js_Any__s_Option(item), $m_Lorg_rebeam_downshift_Downshift$().renderStateFrom__p1__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__Lorg_rebeam_downshift_Downshift$RenderState(c))).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.org$rebeam$downshift$Downshift$$$anonfun$apply$4__sjs_js_Any__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F2__V = (function(inputValue, c, onInputValueChange$1) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(onInputValueChange$1.apply__O__O__O($m_Lorg_rebeam_downshift_Downshift$().denullString__p1__sjs_js_Any__T(inputValue), $m_Lorg_rebeam_downshift_Downshift$().renderStateFrom__p1__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__Lorg_rebeam_downshift_Downshift$RenderState(c))).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.denullString__p1__sjs_js_Any__T = (function(v) {
  return ((v === null) ? "" : $objectToString(v))
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.renderStateFrom__p1__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__Lorg_rebeam_downshift_Downshift$RenderState = (function(c) {
  return new $c_Lorg_rebeam_downshift_Downshift$RenderState().init___F1__F1__F1__F1__F1__F1__Z__T__s_Option__s_Option__T__sjs_js_Function0__sjs_js_Function0__sjs_js_Function1__sjs_js_Function1($m_sjs_js_Any$().toFunction1__sjs_js_Function1__F1(c.getToggleButtonProps), $m_sjs_js_Any$().toFunction1__sjs_js_Function1__F1(c.getInputProps), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, c$1) {
    return (function(i$2) {
      var i = $as_Lorg_rebeam_downshift_Downshift$ItemData(i$2);
      return (0, c$1.getItemProps)(i.toJS__Lorg_rebeam_downshift_Downshift$GetItemPropsParams())
    })
  })(this, c)), $m_sjs_js_Any$().toFunction1__sjs_js_Function1__F1(c.getLabelProps), $m_sjs_js_Any$().toFunction1__sjs_js_Function1__F1(c.getMenuProps), $m_sjs_js_Any$().toFunction1__sjs_js_Function1__F1(c.getRootProps), $uZ(c.isOpen), this.denullString__p1__sjs_js_Any__T(c.inputValue), this.optionInt__p1__sjs_js_Any__s_Option(c.highlightedIndex), this.option__p1__sjs_js_Any__s_Option(c.selectedItem), $as_T(c.id), c.openMenu, c.closeMenu, c.selectItemAtIndex, c.setHighlightedIndex)
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.org$rebeam$downshift$Downshift$$$anonfun$apply$5__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__F1__Ljapgolly_scalajs_react_raw_React$Element = (function(e, children$1) {
  return $as_Ljapgolly_scalajs_react_vdom_VdomElement(children$1.apply__O__O($m_Lorg_rebeam_downshift_Downshift$().renderStateFrom__p1__Lorg_rebeam_downshift_Downshift$ChildrenFunctionParams__Lorg_rebeam_downshift_Downshift$RenderState(e))).rawElement$2
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.jsFnComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((8 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-downshift\\js\\src\\main\\scala\\org\\rebeam\\downshift\\Downshift.scala: 155")
  };
  return this.jsFnComponent$1
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.optionInt__p1__sjs_js_Any__s_Option = (function(v) {
  return ((v === null) ? $m_s_None$() : new $c_s_Some().init___O($uI(v)))
});
var $d_Lorg_rebeam_downshift_Downshift$ = new $TypeData().initClass({
  Lorg_rebeam_downshift_Downshift$: 0
}, false, "org.rebeam.downshift.Downshift$", {
  Lorg_rebeam_downshift_Downshift$: 1,
  O: 1
});
$c_Lorg_rebeam_downshift_Downshift$.prototype.$classData = $d_Lorg_rebeam_downshift_Downshift$;
var $n_Lorg_rebeam_downshift_Downshift$ = (void 0);
function $m_Lorg_rebeam_downshift_Downshift$() {
  if ((!$n_Lorg_rebeam_downshift_Downshift$)) {
    $n_Lorg_rebeam_downshift_Downshift$ = new $c_Lorg_rebeam_downshift_Downshift$().init___()
  };
  return $n_Lorg_rebeam_downshift_Downshift$
}
/** @constructor */
function $c_Lorg_rebeam_mui_Card$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_Card$.prototype = new $h_O();
$c_Lorg_rebeam_mui_Card$.prototype.constructor = $c_Lorg_rebeam_mui_Card$;
/** @constructor */
function $h_Lorg_rebeam_mui_Card$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_Card$.prototype = $c_Lorg_rebeam_mui_Card$.prototype;
$c_Lorg_rebeam_mui_Card$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_Card$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_$0040material$002dui$002fcore$002fCard), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.Card.jsComponent"), new $c_Lsourcecode_Line().init___I(28));
  this.bitmap$init$0$1 = (((2 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_Card$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((2 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\Card.scala: 28")
  };
  return this.jsComponent$1
});
$c_Lorg_rebeam_mui_Card$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(className, classes, component, elevation, key, raised, square, style, additionalProps) {
  var p = {};
  if ((className !== (void 0))) {
    p.className = className
  };
  if ((classes !== (void 0))) {
    p.classes = classes
  };
  if ((component !== (void 0))) {
    p.component = component
  };
  if ((elevation !== (void 0))) {
    p.elevation = elevation
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((raised !== (void 0))) {
    p.raised = raised
  };
  if ((square !== (void 0))) {
    p.square = square
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$1 = v
    };
    p.style = jsx$1
  };
  if ((additionalProps !== (void 0))) {
    var this$45 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$45, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$47 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$47.construct$2.apply__O__O__O(p, this$47.mods$2))
});
var $d_Lorg_rebeam_mui_Card$ = new $TypeData().initClass({
  Lorg_rebeam_mui_Card$: 0
}, false, "org.rebeam.mui.Card$", {
  Lorg_rebeam_mui_Card$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_Card$.prototype.$classData = $d_Lorg_rebeam_mui_Card$;
var $n_Lorg_rebeam_mui_Card$ = (void 0);
function $m_Lorg_rebeam_mui_Card$() {
  if ((!$n_Lorg_rebeam_mui_Card$)) {
    $n_Lorg_rebeam_mui_Card$ = new $c_Lorg_rebeam_mui_Card$().init___()
  };
  return $n_Lorg_rebeam_mui_Card$
}
/** @constructor */
function $c_Lorg_rebeam_mui_Chip$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_Chip$.prototype = new $h_O();
$c_Lorg_rebeam_mui_Chip$.prototype.constructor = $c_Lorg_rebeam_mui_Chip$;
/** @constructor */
function $h_Lorg_rebeam_mui_Chip$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_Chip$.prototype = $c_Lorg_rebeam_mui_Chip$.prototype;
$c_Lorg_rebeam_mui_Chip$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_Chip$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_$0040material$002dui$002fcore$002fChip), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.Chip.jsComponent"), new $c_Lsourcecode_Line().init___I(42));
  this.bitmap$init$0$1 = (((4 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_Chip$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((4 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\Chip.scala: 42")
  };
  return this.jsComponent$1
});
$c_Lorg_rebeam_mui_Chip$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(avatar, className, classes, clickable, color, component, deleteIcon, key, label, onClick, onDelete, onKeyDown, style, tabIndex, additionalProps) {
  var p = {};
  if ((avatar !== (void 0))) {
    if ((avatar === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_Ljapgolly_scalajs_react_vdom_VdomElement(avatar);
      var value = v.rawElement$2;
      var jsx$1 = value
    };
    p.avatar = jsx$1
  };
  if ((className !== (void 0))) {
    p.className = className
  };
  if ((classes !== (void 0))) {
    p.classes = classes
  };
  if ((clickable !== (void 0))) {
    p.clickable = clickable
  };
  if ((color !== (void 0))) {
    if ((color === (void 0))) {
      var jsx$2 = (void 0)
    } else {
      var v$3 = $as_Lorg_rebeam_mui_Chip$Color(color);
      var value$1 = v$3.value__T();
      var jsx$2 = value$1
    };
    p.color = jsx$2
  };
  if ((component !== (void 0))) {
    p.component = component
  };
  if ((deleteIcon !== (void 0))) {
    if ((deleteIcon === (void 0))) {
      var jsx$3 = (void 0)
    } else {
      var v$4 = $as_Ljapgolly_scalajs_react_vdom_VdomElement(deleteIcon);
      var value$2 = v$4.rawElement$2;
      var jsx$3 = value$2
    };
    p.deleteIcon = jsx$3
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((label !== (void 0))) {
    if ((label === (void 0))) {
      var jsx$4 = (void 0)
    } else {
      var v$5 = $as_Ljapgolly_scalajs_react_vdom_VdomNode(label);
      var value$3 = v$5.rawNode$1;
      var jsx$4 = value$3
    };
    p.label = jsx$4
  };
  if ((onClick !== (void 0))) {
    if ((onClick === (void 0))) {
      var jsx$5 = (void 0)
    } else {
      var v$6 = $as_F1(onClick);
      var value$4 = (function(v$1) {
        return (function(arg1$2) {
          $m_Lorg_rebeam_mui_Chip$().org$rebeam$mui$Chip$$$anonfun$apply$6__Ljapgolly_scalajs_react_raw_SyntheticMouseEvent__F1__V(arg1$2, v$1)
        })
      })(v$6);
      var jsx$5 = value$4
    };
    p.onClick = jsx$5
  };
  if ((onDelete !== (void 0))) {
    if ((onDelete === (void 0))) {
      var jsx$6 = (void 0)
    } else {
      var v$7 = $as_Ljapgolly_scalajs_react_CallbackTo(onDelete).japgolly$scalajs$react$CallbackTo$$f$1;
      var value$5 = $m_Ljapgolly_scalajs_react_CallbackTo$().toJsFn$extension__F0__sjs_js_Function0(v$7);
      var jsx$6 = value$5
    };
    p.onDelete = jsx$6
  };
  if ((onKeyDown !== (void 0))) {
    if ((onKeyDown === (void 0))) {
      var jsx$7 = (void 0)
    } else {
      var v$8 = $as_F1(onKeyDown);
      var value$6 = (function(v$2) {
        return (function(arg1$2$1) {
          $m_Lorg_rebeam_mui_Chip$().org$rebeam$mui$Chip$$$anonfun$apply$9__Ljapgolly_scalajs_react_raw_SyntheticKeyboardEvent__F1__V(arg1$2$1, v$2)
        })
      })(v$8);
      var jsx$7 = value$6
    };
    p.onKeyDown = jsx$7
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$8 = (void 0)
    } else {
      var v$9 = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$8 = v$9
    };
    p.style = jsx$8
  };
  if ((tabIndex !== (void 0))) {
    p.tabIndex = tabIndex
  };
  if ((additionalProps !== (void 0))) {
    var this$111 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$111, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value$7 = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value$7
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$113 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$113.construct$2.apply__O__O__O(p, this$113.mods$2))
});
$c_Lorg_rebeam_mui_Chip$.prototype.org$rebeam$mui$Chip$$$anonfun$apply$6__Ljapgolly_scalajs_react_raw_SyntheticMouseEvent__F1__V = (function(e, v$1) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$1.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_mui_Chip$.prototype.org$rebeam$mui$Chip$$$anonfun$apply$9__Ljapgolly_scalajs_react_raw_SyntheticKeyboardEvent__F1__V = (function(e, v$2) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$2.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
var $d_Lorg_rebeam_mui_Chip$ = new $TypeData().initClass({
  Lorg_rebeam_mui_Chip$: 0
}, false, "org.rebeam.mui.Chip$", {
  Lorg_rebeam_mui_Chip$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_Chip$.prototype.$classData = $d_Lorg_rebeam_mui_Chip$;
var $n_Lorg_rebeam_mui_Chip$ = (void 0);
function $m_Lorg_rebeam_mui_Chip$() {
  if ((!$n_Lorg_rebeam_mui_Chip$)) {
    $n_Lorg_rebeam_mui_Chip$ = new $c_Lorg_rebeam_mui_Chip$().init___()
  };
  return $n_Lorg_rebeam_mui_Chip$
}
/** @constructor */
function $c_Lorg_rebeam_mui_MenuItem$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_MenuItem$.prototype = new $h_O();
$c_Lorg_rebeam_mui_MenuItem$.prototype.constructor = $c_Lorg_rebeam_mui_MenuItem$;
/** @constructor */
function $h_Lorg_rebeam_mui_MenuItem$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_MenuItem$.prototype = $c_Lorg_rebeam_mui_MenuItem$.prototype;
$c_Lorg_rebeam_mui_MenuItem$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_MenuItem$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_$0040material$002dui$002fcore$002fMenuItem), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonPC__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.MenuItem.jsComponent"), new $c_Lsourcecode_Line().init___I(36));
  this.bitmap$init$0$1 = (((2 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_MenuItem$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(ContainerComponent, ContainerProps, button, className, classes, component, dense, disableGutters, disabled, divider, focusVisibleClassName, key, onClick, role, selected, style, additionalProps, children) {
  var p = {};
  if ((ContainerComponent !== (void 0))) {
    p.ContainerComponent = ContainerComponent
  };
  if ((ContainerProps !== (void 0))) {
    p.ContainerProps = ContainerProps
  };
  if ((button !== (void 0))) {
    p.button = button
  };
  if ((className !== (void 0))) {
    p.className = className
  };
  if ((classes !== (void 0))) {
    p.classes = classes
  };
  if ((component !== (void 0))) {
    p.component = component
  };
  if ((dense !== (void 0))) {
    p.dense = dense
  };
  if ((disableGutters !== (void 0))) {
    p.disableGutters = disableGutters
  };
  if ((disabled !== (void 0))) {
    p.disabled = disabled
  };
  if ((divider !== (void 0))) {
    p.divider = divider
  };
  if ((focusVisibleClassName !== (void 0))) {
    p.focusVisibleClassName = focusVisibleClassName
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((onClick !== (void 0))) {
    if ((onClick === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_F1(onClick);
      var value = (function(v$1) {
        return (function(arg1$2) {
          $m_Lorg_rebeam_mui_MenuItem$().org$rebeam$mui$MenuItem$$$anonfun$apply$2__Ljapgolly_scalajs_react_raw_SyntheticMouseEvent__F1__V(arg1$2, v$1)
        })
      })(v);
      var jsx$1 = value
    };
    p.onClick = jsx$1
  };
  if ((role !== (void 0))) {
    p.role = role
  };
  if ((selected !== (void 0))) {
    p.selected = selected
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$2 = (void 0)
    } else {
      var v$3 = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$2 = v$3
    };
    p.style = jsx$2
  };
  if ((additionalProps !== (void 0))) {
    var this$83 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$83, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value$1 = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value$1
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$85 = $as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$85.construct$2.apply__O__O__O__O(p, this$85.mods$2, children))
});
$c_Lorg_rebeam_mui_MenuItem$.prototype.org$rebeam$mui$MenuItem$$$anonfun$apply$2__Ljapgolly_scalajs_react_raw_SyntheticMouseEvent__F1__V = (function(e, v$1) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$1.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_mui_MenuItem$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((2 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\MenuItem.scala: 36")
  };
  return this.jsComponent$1
});
var $d_Lorg_rebeam_mui_MenuItem$ = new $TypeData().initClass({
  Lorg_rebeam_mui_MenuItem$: 0
}, false, "org.rebeam.mui.MenuItem$", {
  Lorg_rebeam_mui_MenuItem$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_MenuItem$.prototype.$classData = $d_Lorg_rebeam_mui_MenuItem$;
var $n_Lorg_rebeam_mui_MenuItem$ = (void 0);
function $m_Lorg_rebeam_mui_MenuItem$() {
  if ((!$n_Lorg_rebeam_mui_MenuItem$)) {
    $n_Lorg_rebeam_mui_MenuItem$ = new $c_Lorg_rebeam_mui_MenuItem$().init___()
  };
  return $n_Lorg_rebeam_mui_MenuItem$
}
/** @constructor */
function $c_Lorg_rebeam_mui_MuiThemeProvider$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype = new $h_O();
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype.constructor = $c_Lorg_rebeam_mui_MuiThemeProvider$;
/** @constructor */
function $h_Lorg_rebeam_mui_MuiThemeProvider$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_MuiThemeProvider$.prototype = $c_Lorg_rebeam_mui_MuiThemeProvider$.prototype;
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_MuiThemeProvider$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($i_$0040material$002dui$002fcore$002fstyles.MuiThemeProvider, $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonPC__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.MuiThemeProvider.jsComponent"), new $c_Lsourcecode_Line().init___I(25));
  this.bitmap$init$0$1 = (((2 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_Any__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(disableStylesGeneration, key, sheetsManager, style, theme, additionalProps, children) {
  var p = {};
  if ((disableStylesGeneration !== (void 0))) {
    p.disableStylesGeneration = disableStylesGeneration
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((sheetsManager !== (void 0))) {
    p.sheetsManager = sheetsManager
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$1 = v
    };
    p.style = jsx$1
  };
  p.theme = theme;
  if ((additionalProps !== (void 0))) {
    var this$29 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$29, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$31 = $as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(this$31.construct$2.apply__O__O__O__O(p, this$31.mods$2, children))
});
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((2 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\MuiThemeProvider.scala: 25")
  };
  return this.jsComponent$1
});
var $d_Lorg_rebeam_mui_MuiThemeProvider$ = new $TypeData().initClass({
  Lorg_rebeam_mui_MuiThemeProvider$: 0
}, false, "org.rebeam.mui.MuiThemeProvider$", {
  Lorg_rebeam_mui_MuiThemeProvider$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_MuiThemeProvider$.prototype.$classData = $d_Lorg_rebeam_mui_MuiThemeProvider$;
var $n_Lorg_rebeam_mui_MuiThemeProvider$ = (void 0);
function $m_Lorg_rebeam_mui_MuiThemeProvider$() {
  if ((!$n_Lorg_rebeam_mui_MuiThemeProvider$)) {
    $n_Lorg_rebeam_mui_MuiThemeProvider$ = new $c_Lorg_rebeam_mui_MuiThemeProvider$().init___()
  };
  return $n_Lorg_rebeam_mui_MuiThemeProvider$
}
/** @constructor */
function $c_Lorg_rebeam_mui_Paper$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_Paper$.prototype = new $h_O();
$c_Lorg_rebeam_mui_Paper$.prototype.constructor = $c_Lorg_rebeam_mui_Paper$;
/** @constructor */
function $h_Lorg_rebeam_mui_Paper$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_Paper$.prototype = $c_Lorg_rebeam_mui_Paper$.prototype;
$c_Lorg_rebeam_mui_Paper$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sc_Seq__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(className, classes, component, elevation, key, square, style, additionalProps, children) {
  var p = {};
  if ((className !== (void 0))) {
    p.className = className
  };
  if ((classes !== (void 0))) {
    p.classes = classes
  };
  if ((component !== (void 0))) {
    p.component = component
  };
  if ((elevation !== (void 0))) {
    p.elevation = elevation
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((square !== (void 0))) {
    p.square = square
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$1 = v
    };
    p.style = jsx$1
  };
  if ((additionalProps !== (void 0))) {
    var this$41 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$41, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$43 = $as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$43.construct$2.apply__O__O__O__O(p, this$43.mods$2, children))
});
$c_Lorg_rebeam_mui_Paper$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_Paper$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_$0040material$002dui$002fcore$002fPaper), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonPC__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.Paper.jsComponent"), new $c_Lsourcecode_Line().init___I(27));
  this.bitmap$init$0$1 = (((2 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_Paper$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((2 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\Paper.scala: 27")
  };
  return this.jsComponent$1
});
var $d_Lorg_rebeam_mui_Paper$ = new $TypeData().initClass({
  Lorg_rebeam_mui_Paper$: 0
}, false, "org.rebeam.mui.Paper$", {
  Lorg_rebeam_mui_Paper$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_Paper$.prototype.$classData = $d_Lorg_rebeam_mui_Paper$;
var $n_Lorg_rebeam_mui_Paper$ = (void 0);
function $m_Lorg_rebeam_mui_Paper$() {
  if ((!$n_Lorg_rebeam_mui_Paper$)) {
    $n_Lorg_rebeam_mui_Paper$ = new $c_Lorg_rebeam_mui_Paper$().init___()
  };
  return $n_Lorg_rebeam_mui_Paper$
}
/** @constructor */
function $c_Lorg_rebeam_mui_TextField$() {
  $c_O.call(this);
  this.jsComponent$1 = null;
  this.bitmap$init$0$1 = 0
}
$c_Lorg_rebeam_mui_TextField$.prototype = new $h_O();
$c_Lorg_rebeam_mui_TextField$.prototype.constructor = $c_Lorg_rebeam_mui_TextField$;
/** @constructor */
function $h_Lorg_rebeam_mui_TextField$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_TextField$.prototype = $c_Lorg_rebeam_mui_TextField$.prototype;
$c_Lorg_rebeam_mui_TextField$.prototype.init___ = (function() {
  $n_Lorg_rebeam_mui_TextField$ = this;
  this.jsComponent$1 = $m_Ljapgolly_scalajs_react_package$().JsFnComponent$1.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot($moduleDefault($i_$0040material$002dui$002fcore$002fTextField), $m_Ljapgolly_scalajs_react_CtorType$Summoner$().summonP__Ljapgolly_scalajs_react_internal_Singleton$Not__Ljapgolly_scalajs_react_CtorType$Summoner(($m_Ljapgolly_scalajs_react_internal_Singleton$(), null)), new $c_Lsourcecode_FullName().init___T("org.rebeam.mui.TextField.jsComponent"), new $c_Lsourcecode_Line().init___I(61));
  this.bitmap$init$0$1 = (((4 | this.bitmap$init$0$1) << 24) >> 24);
  return this
});
$c_Lorg_rebeam_mui_TextField$.prototype.org$rebeam$mui$TextField$$$anonfun$apply$9__Ljapgolly_scalajs_react_raw_SyntheticFocusEvent__F1__V = (function(e, v$3) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$3.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_mui_TextField$.prototype.apply__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__sjs_js_UndefOr__Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot = (function(FormHelperTextProps, InputLabelProps, InputProps, SelectProps, autoComplete, autoFocus, className, classes, component, defaultValue, disabled, error, fullWidth, helperText, id, inputProps, inputRef, key, label, margin, multiline, name, onBlur, onChange, onFocus, placeholder, required, rows, rowsMax, select, style, type, value, additionalProps) {
  var p = {};
  if ((FormHelperTextProps !== (void 0))) {
    p.FormHelperTextProps = FormHelperTextProps
  };
  if ((InputLabelProps !== (void 0))) {
    p.InputLabelProps = InputLabelProps
  };
  if ((InputProps !== (void 0))) {
    p.InputProps = InputProps
  };
  if ((SelectProps !== (void 0))) {
    p.SelectProps = SelectProps
  };
  if ((autoComplete !== (void 0))) {
    p.autoComplete = autoComplete
  };
  if ((autoFocus !== (void 0))) {
    p.autoFocus = autoFocus
  };
  if ((className !== (void 0))) {
    p.className = className
  };
  if ((classes !== (void 0))) {
    p.classes = classes
  };
  if ((component !== (void 0))) {
    p.component = component
  };
  if ((defaultValue !== (void 0))) {
    p.defaultValue = defaultValue
  };
  if ((disabled !== (void 0))) {
    p.disabled = disabled
  };
  if ((error !== (void 0))) {
    p.error = error
  };
  if ((fullWidth !== (void 0))) {
    p.fullWidth = fullWidth
  };
  if ((helperText !== (void 0))) {
    if ((helperText === (void 0))) {
      var jsx$1 = (void 0)
    } else {
      var v = $as_Ljapgolly_scalajs_react_vdom_VdomNode(helperText);
      var value$1 = v.rawNode$1;
      var jsx$1 = value$1
    };
    p.helperText = jsx$1
  };
  if ((id !== (void 0))) {
    p.id = id
  };
  if ((inputProps !== (void 0))) {
    p.inputProps = inputProps
  };
  if ((inputRef !== (void 0))) {
    p.inputRef = inputRef
  };
  if ((key !== (void 0))) {
    p.key = key
  };
  if ((label !== (void 0))) {
    if ((label === (void 0))) {
      var jsx$2 = (void 0)
    } else {
      var v$3 = $as_Ljapgolly_scalajs_react_vdom_VdomNode(label);
      var value$2 = v$3.rawNode$1;
      var jsx$2 = value$2
    };
    p.label = jsx$2
  };
  if ((margin !== (void 0))) {
    if ((margin === (void 0))) {
      var jsx$3 = (void 0)
    } else {
      var v$4 = $as_Lorg_rebeam_mui_TextField$Margin(margin);
      var value$3 = v$4.value__T();
      var jsx$3 = value$3
    };
    p.margin = jsx$3
  };
  if ((multiline !== (void 0))) {
    p.multiline = multiline
  };
  if ((name !== (void 0))) {
    p.name = name
  };
  if ((onBlur !== (void 0))) {
    if ((onBlur === (void 0))) {
      var jsx$4 = (void 0)
    } else {
      var v$5 = $as_F1(onBlur);
      var value$4 = (function(v$1) {
        return (function(arg1$2) {
          $m_Lorg_rebeam_mui_TextField$().org$rebeam$mui$TextField$$$anonfun$apply$5__Ljapgolly_scalajs_react_raw_SyntheticFocusEvent__F1__V(arg1$2, v$1)
        })
      })(v$5);
      var jsx$4 = value$4
    };
    p.onBlur = jsx$4
  };
  if ((onChange !== (void 0))) {
    if ((onChange === (void 0))) {
      var jsx$5 = (void 0)
    } else {
      var v$6 = $as_F1(onChange);
      var value$5 = (function(v$2) {
        return (function(arg1$2$1) {
          $m_Lorg_rebeam_mui_TextField$().org$rebeam$mui$TextField$$$anonfun$apply$7__Ljapgolly_scalajs_react_raw_SyntheticEvent__F1__V(arg1$2$1, v$2)
        })
      })(v$6);
      var jsx$5 = value$5
    };
    p.onChange = jsx$5
  };
  if ((onFocus !== (void 0))) {
    if ((onFocus === (void 0))) {
      var jsx$6 = (void 0)
    } else {
      var v$7 = $as_F1(onFocus);
      var value$6 = (function(v$3$1) {
        return (function(arg1$2$2) {
          $m_Lorg_rebeam_mui_TextField$().org$rebeam$mui$TextField$$$anonfun$apply$9__Ljapgolly_scalajs_react_raw_SyntheticFocusEvent__F1__V(arg1$2$2, v$3$1)
        })
      })(v$7);
      var jsx$6 = value$6
    };
    p.onFocus = jsx$6
  };
  if ((placeholder !== (void 0))) {
    p.placeholder = placeholder
  };
  if ((required !== (void 0))) {
    p.required = required
  };
  if ((rows !== (void 0))) {
    p.rows = rows
  };
  if ((rowsMax !== (void 0))) {
    p.rowsMax = rowsMax
  };
  if ((select !== (void 0))) {
    p.select = select
  };
  if ((style !== (void 0))) {
    if ((style === (void 0))) {
      var jsx$7 = (void 0)
    } else {
      var v$8 = $as_Lorg_rebeam_mui_styles_Style(style).o$1;
      var jsx$7 = v$8
    };
    p.style = jsx$7
  };
  if ((type !== (void 0))) {
    p.type = type
  };
  if ((value !== (void 0))) {
    p.value = value
  };
  if ((additionalProps !== (void 0))) {
    var this$181 = new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary(additionalProps);
    var p$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(check$ifrefutable$1$2) {
        var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
        return (check$ifrefutable$1 !== null)
      })
    })(this));
    new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$181, p$1).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2$1, p$1$1, pDict) {
      return (function(x$1$2) {
        var x$1 = $as_T2(x$1$2);
        if ((x$1 !== null)) {
          var prop = $as_T(x$1.$$und1$f);
          var value$7 = x$1.$$und2$f;
          if ((!$uZ(p$1$1.hasOwnProperty(prop)))) {
            pDict[prop] = value$7
          }
        } else {
          throw new $c_s_MatchError().init___O(x$1)
        }
      })
    })(this, p, p)))
  };
  var c = this.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot();
  var this$183 = $as_Ljapgolly_scalajs_react_CtorType$Props(c.ctor__Ljapgolly_scalajs_react_CtorType());
  return $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(this$183.construct$2.apply__O__O__O(p, this$183.mods$2))
});
$c_Lorg_rebeam_mui_TextField$.prototype.org$rebeam$mui$TextField$$$anonfun$apply$7__Ljapgolly_scalajs_react_raw_SyntheticEvent__F1__V = (function(e, v$2) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$2.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
$c_Lorg_rebeam_mui_TextField$.prototype.jsComponent__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function() {
  if (((((4 & this.bitmap$init$0$1) << 24) >> 24) === 0)) {
    throw new $c_s_UninitializedFieldError().init___T("Uninitialized field: C:\\Users\\trepi\\Documents\\GitHub\\scalajs-react-material-ui\\js\\src\\main\\scala\\org\\rebeam\\mui\\TextField.scala: 61")
  };
  return this.jsComponent$1
});
$c_Lorg_rebeam_mui_TextField$.prototype.org$rebeam$mui$TextField$$$anonfun$apply$5__Ljapgolly_scalajs_react_raw_SyntheticFocusEvent__F1__V = (function(e, v$1) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(v$1.apply__O__O(e)).japgolly$scalajs$react$CallbackTo$$f$1;
  $$this.apply__O()
});
var $d_Lorg_rebeam_mui_TextField$ = new $TypeData().initClass({
  Lorg_rebeam_mui_TextField$: 0
}, false, "org.rebeam.mui.TextField$", {
  Lorg_rebeam_mui_TextField$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_TextField$.prototype.$classData = $d_Lorg_rebeam_mui_TextField$;
var $n_Lorg_rebeam_mui_TextField$ = (void 0);
function $m_Lorg_rebeam_mui_TextField$() {
  if ((!$n_Lorg_rebeam_mui_TextField$)) {
    $n_Lorg_rebeam_mui_TextField$ = new $c_Lorg_rebeam_mui_TextField$().init___()
  };
  return $n_Lorg_rebeam_mui_TextField$
}
/** @constructor */
function $c_Lorg_rebeam_mui_styles_Styles$() {
  $c_O.call(this);
  this.bitmap$init$0$1 = false
}
$c_Lorg_rebeam_mui_styles_Styles$.prototype = new $h_O();
$c_Lorg_rebeam_mui_styles_Styles$.prototype.constructor = $c_Lorg_rebeam_mui_styles_Styles$;
/** @constructor */
function $h_Lorg_rebeam_mui_styles_Styles$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_styles_Styles$.prototype = $c_Lorg_rebeam_mui_styles_Styles$.prototype;
$c_Lorg_rebeam_mui_styles_Styles$.prototype.init___ = (function() {
  return this
});
$c_Lorg_rebeam_mui_styles_Styles$.prototype.createMuiTheme__sjs_js_Object__sjs_js_Object = (function(theme) {
  return (0, $i_$0040material$002dui$002fcore$002fstyles.createMuiTheme)(theme)
});
var $d_Lorg_rebeam_mui_styles_Styles$ = new $TypeData().initClass({
  Lorg_rebeam_mui_styles_Styles$: 0
}, false, "org.rebeam.mui.styles.Styles$", {
  Lorg_rebeam_mui_styles_Styles$: 1,
  O: 1
});
$c_Lorg_rebeam_mui_styles_Styles$.prototype.$classData = $d_Lorg_rebeam_mui_styles_Styles$;
var $n_Lorg_rebeam_mui_styles_Styles$ = (void 0);
function $m_Lorg_rebeam_mui_styles_Styles$() {
  if ((!$n_Lorg_rebeam_mui_styles_Styles$)) {
    $n_Lorg_rebeam_mui_styles_Styles$ = new $c_Lorg_rebeam_mui_styles_Styles$().init___()
  };
  return $n_Lorg_rebeam_mui_styles_Styles$
}
/** @constructor */
function $c_Lorg_scalajs_dom_package$() {
  $c_O.call(this);
  this.ApplicationCache$1 = null;
  this.Blob$1 = null;
  this.BlobPropertyBag$1 = null;
  this.ClipboardEventInit$1 = null;
  this.DOMException$1 = null;
  this.Event$1 = null;
  this.EventException$1 = null;
  this.EventSource$1 = null;
  this.FileReader$1 = null;
  this.FormData$1 = null;
  this.KeyboardEvent$1 = null;
  this.MediaError$1 = null;
  this.MutationEvent$1 = null;
  this.MutationObserverInit$1 = null;
  this.Node$1 = null;
  this.NodeFilter$1 = null;
  this.PerformanceNavigation$1 = null;
  this.PositionError$1 = null;
  this.Range$1 = null;
  this.TextEvent$1 = null;
  this.TextTrack$1 = null;
  this.URL$1 = null;
  this.VisibilityState$1 = null;
  this.WebSocket$1 = null;
  this.WheelEvent$1 = null;
  this.XMLHttpRequest$1 = null;
  this.XPathResult$1 = null;
  this.window$1 = null;
  this.document$1 = null;
  this.console$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lorg_scalajs_dom_package$.prototype = new $h_O();
$c_Lorg_scalajs_dom_package$.prototype.constructor = $c_Lorg_scalajs_dom_package$;
/** @constructor */
function $h_Lorg_scalajs_dom_package$() {
  /*<skip>*/
}
$h_Lorg_scalajs_dom_package$.prototype = $c_Lorg_scalajs_dom_package$.prototype;
$c_Lorg_scalajs_dom_package$.prototype.init___ = (function() {
  return this
});
$c_Lorg_scalajs_dom_package$.prototype.console$lzycompute__p1__Lorg_scalajs_dom_raw_Console = (function() {
  if (((536870912 & this.bitmap$0$1) === 0)) {
    this.console$1 = this.window__Lorg_scalajs_dom_raw_Window().console;
    this.bitmap$0$1 = (536870912 | this.bitmap$0$1)
  };
  return this.console$1
});
$c_Lorg_scalajs_dom_package$.prototype.document__Lorg_scalajs_dom_raw_HTMLDocument = (function() {
  return (((268435456 & this.bitmap$0$1) === 0) ? this.document$lzycompute__p1__Lorg_scalajs_dom_raw_HTMLDocument() : this.document$1)
});
$c_Lorg_scalajs_dom_package$.prototype.window__Lorg_scalajs_dom_raw_Window = (function() {
  return (((134217728 & this.bitmap$0$1) === 0) ? this.window$lzycompute__p1__Lorg_scalajs_dom_raw_Window() : this.window$1)
});
$c_Lorg_scalajs_dom_package$.prototype.window$lzycompute__p1__Lorg_scalajs_dom_raw_Window = (function() {
  if (((134217728 & this.bitmap$0$1) === 0)) {
    this.window$1 = $g.window;
    this.bitmap$0$1 = (134217728 | this.bitmap$0$1)
  };
  return this.window$1
});
$c_Lorg_scalajs_dom_package$.prototype.document$lzycompute__p1__Lorg_scalajs_dom_raw_HTMLDocument = (function() {
  if (((268435456 & this.bitmap$0$1) === 0)) {
    this.document$1 = this.window__Lorg_scalajs_dom_raw_Window().document;
    this.bitmap$0$1 = (268435456 | this.bitmap$0$1)
  };
  return this.document$1
});
$c_Lorg_scalajs_dom_package$.prototype.console__Lorg_scalajs_dom_raw_Console = (function() {
  return (((536870912 & this.bitmap$0$1) === 0) ? this.console$lzycompute__p1__Lorg_scalajs_dom_raw_Console() : this.console$1)
});
var $d_Lorg_scalajs_dom_package$ = new $TypeData().initClass({
  Lorg_scalajs_dom_package$: 0
}, false, "org.scalajs.dom.package$", {
  Lorg_scalajs_dom_package$: 1,
  O: 1
});
$c_Lorg_scalajs_dom_package$.prototype.$classData = $d_Lorg_scalajs_dom_package$;
var $n_Lorg_scalajs_dom_package$ = (void 0);
function $m_Lorg_scalajs_dom_package$() {
  if ((!$n_Lorg_scalajs_dom_package$)) {
    $n_Lorg_scalajs_dom_package$ = new $c_Lorg_scalajs_dom_package$().init___()
  };
  return $n_Lorg_scalajs_dom_package$
}
/** @constructor */
function $c_Lsourcecode_SourceValue() {
  $c_O.call(this)
}
$c_Lsourcecode_SourceValue.prototype = new $h_O();
$c_Lsourcecode_SourceValue.prototype.constructor = $c_Lsourcecode_SourceValue;
/** @constructor */
function $h_Lsourcecode_SourceValue() {
  /*<skip>*/
}
$h_Lsourcecode_SourceValue.prototype = $c_Lsourcecode_SourceValue.prototype;
/** @constructor */
function $c_jl_Class() {
  $c_O.call(this);
  this.data$1 = null
}
$c_jl_Class.prototype = new $h_O();
$c_jl_Class.prototype.constructor = $c_jl_Class;
/** @constructor */
function $h_jl_Class() {
  /*<skip>*/
}
$h_jl_Class.prototype = $c_jl_Class.prototype;
$c_jl_Class.prototype.getName__T = (function() {
  return $as_T(this.data$1.name)
});
$c_jl_Class.prototype.isPrimitive__Z = (function() {
  return $uZ(this.data$1.isPrimitive)
});
$c_jl_Class.prototype.toString__T = (function() {
  return ((this.isInterface__Z() ? "interface " : (this.isPrimitive__Z() ? "" : "class ")) + this.getName__T())
});
$c_jl_Class.prototype.isAssignableFrom__jl_Class__Z = (function(that) {
  return ((this.isPrimitive__Z() || that.isPrimitive__Z()) ? ((this === that) || ((this === $d_S.getClassOf()) ? (that === $d_B.getClassOf()) : ((this === $d_I.getClassOf()) ? ((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) : ((this === $d_F.getClassOf()) ? (((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) : ((this === $d_D.getClassOf()) && ((((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) || (that === $d_F.getClassOf()))))))) : this.isInstance__O__Z(that.getFakeInstance__p1__O()))
});
$c_jl_Class.prototype.isInstance__O__Z = (function(obj) {
  return $uZ(this.data$1.isInstance(obj))
});
$c_jl_Class.prototype.init___jl_ScalaJSClassData = (function(data) {
  this.data$1 = data;
  return this
});
$c_jl_Class.prototype.getFakeInstance__p1__O = (function() {
  return this.data$1.getFakeInstance()
});
$c_jl_Class.prototype.isArray__Z = (function() {
  return $uZ(this.data$1.isArrayClass)
});
$c_jl_Class.prototype.isInterface__Z = (function() {
  return $uZ(this.data$1.isInterface)
});
var $d_jl_Class = new $TypeData().initClass({
  jl_Class: 0
}, false, "java.lang.Class", {
  jl_Class: 1,
  O: 1
});
$c_jl_Class.prototype.$classData = $d_jl_Class;
/** @constructor */
function $c_jl_System$() {
  $c_O.call(this);
  this.out$1 = null;
  this.err$1 = null;
  this.in$1 = null;
  this.getHighPrecisionTime$1 = null
}
$c_jl_System$.prototype = new $h_O();
$c_jl_System$.prototype.constructor = $c_jl_System$;
/** @constructor */
function $h_jl_System$() {
  /*<skip>*/
}
$h_jl_System$.prototype = $c_jl_System$.prototype;
$c_jl_System$.prototype.init___ = (function() {
  $n_jl_System$ = this;
  this.out$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(false);
  this.err$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(true);
  this.in$1 = null;
  var x = $g.performance;
  if ($uZ((!(!x)))) {
    var x$1 = $g.performance.now;
    if ($uZ((!(!x$1)))) {
      var jsx$1 = (function() {
        return $m_jl_System$().java$lang$System$$$anonfun$getHighPrecisionTime$1__D()
      })
    } else {
      var x$2 = $g.performance.webkitNow;
      if ($uZ((!(!x$2)))) {
        var jsx$1 = (function() {
          return $m_jl_System$().java$lang$System$$$anonfun$getHighPrecisionTime$2__D()
        })
      } else {
        var jsx$1 = (function() {
          return $m_jl_System$().java$lang$System$$$anonfun$getHighPrecisionTime$3__D()
        })
      }
    }
  } else {
    var jsx$1 = (function() {
      return $m_jl_System$().java$lang$System$$$anonfun$getHighPrecisionTime$4__D()
    })
  };
  this.getHighPrecisionTime$1 = jsx$1;
  return this
});
$c_jl_System$.prototype.java$lang$System$$$anonfun$getHighPrecisionTime$3__D = (function() {
  return $uD(new $g.Date().getTime())
});
$c_jl_System$.prototype.java$lang$System$$$anonfun$getHighPrecisionTime$1__D = (function() {
  return $uD($g.performance.now())
});
$c_jl_System$.prototype.java$lang$System$$$anonfun$getHighPrecisionTime$4__D = (function() {
  return $uD(new $g.Date().getTime())
});
$c_jl_System$.prototype.java$lang$System$$$anonfun$getHighPrecisionTime$2__D = (function() {
  return $uD($g.performance.webkitNow())
});
var $d_jl_System$ = new $TypeData().initClass({
  jl_System$: 0
}, false, "java.lang.System$", {
  jl_System$: 1,
  O: 1
});
$c_jl_System$.prototype.$classData = $d_jl_System$;
var $n_jl_System$ = (void 0);
function $m_jl_System$() {
  if ((!$n_jl_System$)) {
    $n_jl_System$ = new $c_jl_System$().init___()
  };
  return $n_jl_System$
}
/** @constructor */
function $c_ju_Arrays$() {
  $c_O.call(this)
}
$c_ju_Arrays$.prototype = new $h_O();
$c_ju_Arrays$.prototype.constructor = $c_ju_Arrays$;
/** @constructor */
function $h_ju_Arrays$() {
  /*<skip>*/
}
$h_ju_Arrays$.prototype = $c_ju_Arrays$.prototype;
$c_ju_Arrays$.prototype.init___ = (function() {
  return this
});
$c_ju_Arrays$.prototype.binarySearch__AI__I__I = (function(a, key) {
  var startIndex = 0;
  var endIndex = a.u.length;
  _binarySearchImpl: while (true) {
    if ((startIndex === endIndex)) {
      return (((-1) - startIndex) | 0)
    } else {
      var mid = ((((startIndex + endIndex) | 0) >>> 1) | 0);
      var elem = a.get(mid);
      if ((key < elem)) {
        endIndex = mid;
        continue _binarySearchImpl
      } else if ($m_sr_BoxesRunTime$().equals__O__O__Z(key, elem)) {
        return mid
      } else {
        startIndex = ((1 + mid) | 0);
        continue _binarySearchImpl
      }
    }
  }
});
$c_ju_Arrays$.prototype.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V = (function(a, start, end, ord) {
  var n = ((end - start) | 0);
  if ((n >= 2)) {
    if ((ord.compare__O__O__I(a.get(start), a.get(((1 + start) | 0))) > 0)) {
      var temp = a.get(start);
      a.set(start, a.get(((1 + start) | 0)));
      a.set(((1 + start) | 0), temp)
    };
    var m = 2;
    while ((m < n)) {
      var next = a.get(((start + m) | 0));
      if ((ord.compare__O__O__I(next, a.get((((-1) + ((start + m) | 0)) | 0))) < 0)) {
        var iA = start;
        var iB = (((-1) + ((start + m) | 0)) | 0);
        while ((((iB - iA) | 0) > 1)) {
          var ix = ((((iA + iB) | 0) >>> 1) | 0);
          if ((ord.compare__O__O__I(next, a.get(ix)) < 0)) {
            iB = ix
          } else {
            iA = ix
          }
        };
        var ix$2 = ((iA + ((ord.compare__O__O__I(next, a.get(iA)) < 0) ? 0 : 1)) | 0);
        var i = ((start + m) | 0);
        while ((i > ix$2)) {
          a.set(i, a.get((((-1) + i) | 0)));
          i = (((-1) + i) | 0)
        };
        a.set(ix$2, next)
      };
      m = ((1 + m) | 0)
    }
  }
});
$c_ju_Arrays$.prototype.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V = (function(a, temp, start, end, ord) {
  var length = ((end - start) | 0);
  if ((length > 16)) {
    var middle = ((start + ((length / 2) | 0)) | 0);
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(a, temp, start, middle, ord);
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(a, temp, middle, end, ord);
    var outIndex = start;
    var leftInIndex = start;
    var rightInIndex = middle;
    while ((outIndex < end)) {
      if ((leftInIndex < middle)) {
        if ((rightInIndex >= end)) {
          var jsx$1 = true
        } else {
          var x = a.get(leftInIndex);
          var y = a.get(rightInIndex);
          var jsx$1 = $f_s_math_Ordering__lteq__O__O__Z(ord, x, y)
        }
      } else {
        var jsx$1 = false
      };
      if (jsx$1) {
        temp.set(outIndex, a.get(leftInIndex));
        leftInIndex = ((1 + leftInIndex) | 0)
      } else {
        temp.set(outIndex, a.get(rightInIndex));
        rightInIndex = ((1 + rightInIndex) | 0)
      };
      outIndex = ((1 + outIndex) | 0)
    };
    $systemArraycopy(temp, start, a, start, length)
  } else {
    this.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V(a, start, end, ord)
  }
});
$c_ju_Arrays$.prototype.sort__AO__ju_Comparator__V = (function(array, comparator) {
  var ord = new $c_ju_Arrays$$anon$3().init___ju_Comparator(comparator);
  var end = array.u.length;
  if ((end > 16)) {
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(array, $newArrayObject($d_O.getArrayOf(), [array.u.length]), 0, end, ord)
  } else {
    this.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V(array, 0, end, ord)
  }
});
var $d_ju_Arrays$ = new $TypeData().initClass({
  ju_Arrays$: 0
}, false, "java.util.Arrays$", {
  ju_Arrays$: 1,
  O: 1
});
$c_ju_Arrays$.prototype.$classData = $d_ju_Arrays$;
var $n_ju_Arrays$ = (void 0);
function $m_ju_Arrays$() {
  if ((!$n_ju_Arrays$)) {
    $n_ju_Arrays$ = new $c_ju_Arrays$().init___()
  };
  return $n_ju_Arrays$
}
/** @constructor */
function $c_ju_Formatter$() {
  $c_O.call(this);
  this.java$util$Formatter$$FormatSpecifier$1 = null
}
$c_ju_Formatter$.prototype = new $h_O();
$c_ju_Formatter$.prototype.constructor = $c_ju_Formatter$;
/** @constructor */
function $h_ju_Formatter$() {
  /*<skip>*/
}
$h_ju_Formatter$.prototype = $c_ju_Formatter$.prototype;
$c_ju_Formatter$.prototype.init___ = (function() {
  $n_ju_Formatter$ = this;
  this.java$util$Formatter$$FormatSpecifier$1 = new $g.RegExp("(?:(\\d+)\\$)?([-#+ 0,\\(<]*)(\\d+)?(?:\\.(\\d+))?[%A-Za-z]", "g");
  return this
});
var $d_ju_Formatter$ = new $TypeData().initClass({
  ju_Formatter$: 0
}, false, "java.util.Formatter$", {
  ju_Formatter$: 1,
  O: 1
});
$c_ju_Formatter$.prototype.$classData = $d_ju_Formatter$;
var $n_ju_Formatter$ = (void 0);
function $m_ju_Formatter$() {
  if ((!$n_ju_Formatter$)) {
    $n_ju_Formatter$ = new $c_ju_Formatter$().init___()
  };
  return $n_ju_Formatter$
}
/** @constructor */
function $c_s_DeprecatedConsole() {
  $c_O.call(this)
}
$c_s_DeprecatedConsole.prototype = new $h_O();
$c_s_DeprecatedConsole.prototype.constructor = $c_s_DeprecatedConsole;
/** @constructor */
function $h_s_DeprecatedConsole() {
  /*<skip>*/
}
$h_s_DeprecatedConsole.prototype = $c_s_DeprecatedConsole.prototype;
/** @constructor */
function $c_s_FallbackArrayBuilding() {
  $c_O.call(this)
}
$c_s_FallbackArrayBuilding.prototype = new $h_O();
$c_s_FallbackArrayBuilding.prototype.constructor = $c_s_FallbackArrayBuilding;
/** @constructor */
function $h_s_FallbackArrayBuilding() {
  /*<skip>*/
}
$h_s_FallbackArrayBuilding.prototype = $c_s_FallbackArrayBuilding.prototype;
/** @constructor */
function $c_s_Predef$any2stringadd$() {
  $c_O.call(this)
}
$c_s_Predef$any2stringadd$.prototype = new $h_O();
$c_s_Predef$any2stringadd$.prototype.constructor = $c_s_Predef$any2stringadd$;
/** @constructor */
function $h_s_Predef$any2stringadd$() {
  /*<skip>*/
}
$h_s_Predef$any2stringadd$.prototype = $c_s_Predef$any2stringadd$.prototype;
$c_s_Predef$any2stringadd$.prototype.init___ = (function() {
  return this
});
$c_s_Predef$any2stringadd$.prototype.$$plus$extension__O__T__T = (function($$this, other) {
  return (("" + $$this) + other)
});
var $d_s_Predef$any2stringadd$ = new $TypeData().initClass({
  s_Predef$any2stringadd$: 0
}, false, "scala.Predef$any2stringadd$", {
  s_Predef$any2stringadd$: 1,
  O: 1
});
$c_s_Predef$any2stringadd$.prototype.$classData = $d_s_Predef$any2stringadd$;
var $n_s_Predef$any2stringadd$ = (void 0);
function $m_s_Predef$any2stringadd$() {
  if ((!$n_s_Predef$any2stringadd$)) {
    $n_s_Predef$any2stringadd$ = new $c_s_Predef$any2stringadd$().init___()
  };
  return $n_s_Predef$any2stringadd$
}
/** @constructor */
function $c_s_math_Ordered$() {
  $c_O.call(this)
}
$c_s_math_Ordered$.prototype = new $h_O();
$c_s_math_Ordered$.prototype.constructor = $c_s_math_Ordered$;
/** @constructor */
function $h_s_math_Ordered$() {
  /*<skip>*/
}
$h_s_math_Ordered$.prototype = $c_s_math_Ordered$.prototype;
$c_s_math_Ordered$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Ordered$ = new $TypeData().initClass({
  s_math_Ordered$: 0
}, false, "scala.math.Ordered$", {
  s_math_Ordered$: 1,
  O: 1
});
$c_s_math_Ordered$.prototype.$classData = $d_s_math_Ordered$;
var $n_s_math_Ordered$ = (void 0);
function $m_s_math_Ordered$() {
  if ((!$n_s_math_Ordered$)) {
    $n_s_math_Ordered$ = new $c_s_math_Ordered$().init___()
  };
  return $n_s_math_Ordered$
}
/** @constructor */
function $c_s_package$() {
  $c_O.call(this);
  this.BigDecimal$1 = null;
  this.BigInt$1 = null;
  this.AnyRef$1 = null;
  this.Traversable$1 = null;
  this.Iterable$1 = null;
  this.Seq$1 = null;
  this.IndexedSeq$1 = null;
  this.Iterator$1 = null;
  this.List$1 = null;
  this.Nil$1 = null;
  this.$$colon$colon$1 = null;
  this.$$plus$colon$1 = null;
  this.$$colon$plus$1 = null;
  this.Stream$1 = null;
  this.$$hash$colon$colon$1 = null;
  this.Vector$1 = null;
  this.StringBuilder$1 = null;
  this.Range$1 = null;
  this.Equiv$1 = null;
  this.Fractional$1 = null;
  this.Integral$1 = null;
  this.Numeric$1 = null;
  this.Ordered$1 = null;
  this.Ordering$1 = null;
  this.Either$1 = null;
  this.Left$1 = null;
  this.Right$1 = null;
  this.bitmap$0$1 = 0
}
$c_s_package$.prototype = new $h_O();
$c_s_package$.prototype.constructor = $c_s_package$;
/** @constructor */
function $h_s_package$() {
  /*<skip>*/
}
$h_s_package$.prototype = $c_s_package$.prototype;
$c_s_package$.prototype.init___ = (function() {
  $n_s_package$ = this;
  this.AnyRef$1 = new $c_s_package$$anon$1().init___();
  this.Traversable$1 = $m_sc_Traversable$();
  this.Iterable$1 = $m_sc_Iterable$();
  this.Seq$1 = $m_sc_Seq$();
  this.IndexedSeq$1 = $m_sc_IndexedSeq$();
  this.Iterator$1 = $m_sc_Iterator$();
  this.List$1 = $m_sci_List$();
  this.Nil$1 = $m_sci_Nil$();
  this.$$colon$colon$1 = $m_sci_$colon$colon$();
  this.$$plus$colon$1 = $m_sc_$plus$colon$();
  this.$$colon$plus$1 = $m_sc_$colon$plus$();
  this.Stream$1 = $m_sci_Stream$();
  this.$$hash$colon$colon$1 = $m_sci_Stream$$hash$colon$colon$();
  this.Vector$1 = $m_sci_Vector$();
  this.StringBuilder$1 = $m_scm_StringBuilder$();
  this.Range$1 = $m_sci_Range$();
  this.Equiv$1 = $m_s_math_Equiv$();
  this.Fractional$1 = $m_s_math_Fractional$();
  this.Integral$1 = $m_s_math_Integral$();
  this.Numeric$1 = $m_s_math_Numeric$();
  this.Ordered$1 = $m_s_math_Ordered$();
  this.Ordering$1 = $m_s_math_Ordering$();
  this.Either$1 = $m_s_util_Either$();
  this.Left$1 = $m_s_util_Left$();
  this.Right$1 = $m_s_util_Right$();
  return this
});
var $d_s_package$ = new $TypeData().initClass({
  s_package$: 0
}, false, "scala.package$", {
  s_package$: 1,
  O: 1
});
$c_s_package$.prototype.$classData = $d_s_package$;
var $n_s_package$ = (void 0);
function $m_s_package$() {
  if ((!$n_s_package$)) {
    $n_s_package$ = new $c_s_package$().init___()
  };
  return $n_s_package$
}
/** @constructor */
function $c_s_util_DynamicVariable() {
  $c_O.call(this);
  this.v$1 = null
}
$c_s_util_DynamicVariable.prototype = new $h_O();
$c_s_util_DynamicVariable.prototype.constructor = $c_s_util_DynamicVariable;
/** @constructor */
function $h_s_util_DynamicVariable() {
  /*<skip>*/
}
$h_s_util_DynamicVariable.prototype = $c_s_util_DynamicVariable.prototype;
$c_s_util_DynamicVariable.prototype.toString__T = (function() {
  return (("DynamicVariable(" + this.v$1) + ")")
});
$c_s_util_DynamicVariable.prototype.init___O = (function(init) {
  this.v$1 = init;
  return this
});
var $d_s_util_DynamicVariable = new $TypeData().initClass({
  s_util_DynamicVariable: 0
}, false, "scala.util.DynamicVariable", {
  s_util_DynamicVariable: 1,
  O: 1
});
$c_s_util_DynamicVariable.prototype.$classData = $d_s_util_DynamicVariable;
/** @constructor */
function $c_s_util_control_Breaks() {
  $c_O.call(this);
  this.scala$util$control$Breaks$$breakException$1 = null
}
$c_s_util_control_Breaks.prototype = new $h_O();
$c_s_util_control_Breaks.prototype.constructor = $c_s_util_control_Breaks;
/** @constructor */
function $h_s_util_control_Breaks() {
  /*<skip>*/
}
$h_s_util_control_Breaks.prototype = $c_s_util_control_Breaks.prototype;
$c_s_util_control_Breaks.prototype.init___ = (function() {
  this.scala$util$control$Breaks$$breakException$1 = new $c_s_util_control_BreakControl().init___();
  return this
});
var $d_s_util_control_Breaks = new $TypeData().initClass({
  s_util_control_Breaks: 0
}, false, "scala.util.control.Breaks", {
  s_util_control_Breaks: 1,
  O: 1
});
$c_s_util_control_Breaks.prototype.$classData = $d_s_util_control_Breaks;
function $is_s_util_control_ControlThrowable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_control_ControlThrowable)))
}
function $as_s_util_control_ControlThrowable(obj) {
  return (($is_s_util_control_ControlThrowable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.control.ControlThrowable"))
}
function $isArrayOf_s_util_control_ControlThrowable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_control_ControlThrowable)))
}
function $asArrayOf_s_util_control_ControlThrowable(obj, depth) {
  return (($isArrayOf_s_util_control_ControlThrowable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.control.ControlThrowable;", depth))
}
/** @constructor */
function $c_s_util_control_NonFatal$() {
  $c_O.call(this)
}
$c_s_util_control_NonFatal$.prototype = new $h_O();
$c_s_util_control_NonFatal$.prototype.constructor = $c_s_util_control_NonFatal$;
/** @constructor */
function $h_s_util_control_NonFatal$() {
  /*<skip>*/
}
$h_s_util_control_NonFatal$.prototype = $c_s_util_control_NonFatal$.prototype;
$c_s_util_control_NonFatal$.prototype.init___ = (function() {
  return this
});
$c_s_util_control_NonFatal$.prototype.apply__jl_Throwable__Z = (function(t) {
  return (!($is_jl_VirtualMachineError(t) || ($is_jl_ThreadDeath(t) || ($is_jl_InterruptedException(t) || ($is_jl_LinkageError(t) || $is_s_util_control_ControlThrowable(t))))))
});
$c_s_util_control_NonFatal$.prototype.unapply__jl_Throwable__s_Option = (function(t) {
  return (this.apply__jl_Throwable__Z(t) ? new $c_s_Some().init___O(t) : $m_s_None$())
});
var $d_s_util_control_NonFatal$ = new $TypeData().initClass({
  s_util_control_NonFatal$: 0
}, false, "scala.util.control.NonFatal$", {
  s_util_control_NonFatal$: 1,
  O: 1
});
$c_s_util_control_NonFatal$.prototype.$classData = $d_s_util_control_NonFatal$;
var $n_s_util_control_NonFatal$ = (void 0);
function $m_s_util_control_NonFatal$() {
  if ((!$n_s_util_control_NonFatal$)) {
    $n_s_util_control_NonFatal$ = new $c_s_util_control_NonFatal$().init___()
  };
  return $n_s_util_control_NonFatal$
}
/** @constructor */
function $c_s_util_hashing_MurmurHash3() {
  $c_O.call(this)
}
$c_s_util_hashing_MurmurHash3.prototype = new $h_O();
$c_s_util_hashing_MurmurHash3.prototype.constructor = $c_s_util_hashing_MurmurHash3;
/** @constructor */
function $h_s_util_hashing_MurmurHash3() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3.prototype = $c_s_util_hashing_MurmurHash3.prototype;
$c_s_util_hashing_MurmurHash3.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_s_util_hashing_MurmurHash3.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_s_util_hashing_MurmurHash3.prototype.avalanche__p1__I__I = (function(hash) {
  var h = hash;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_s_util_hashing_MurmurHash3.prototype.unorderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var a = new $c_sr_IntRef().init___I(0);
  var b = new $c_sr_IntRef().init___I(0);
  var n = new $c_sr_IntRef().init___I(0);
  var c = new $c_sr_IntRef().init___I(1);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, a$1, b$1, n$1, c$1) {
    return (function(x$2) {
      var h = $m_sr_Statics$().anyHash__O__I(x$2);
      a$1.elem$1 = ((a$1.elem$1 + h) | 0);
      b$1.elem$1 = (b$1.elem$1 ^ h);
      if ((h !== 0)) {
        c$1.elem$1 = $imul(c$1.elem$1, h)
      };
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, a, b, n, c)));
  var h$1 = seed;
  h$1 = this.mix__I__I__I(h$1, a.elem$1);
  h$1 = this.mix__I__I__I(h$1, b.elem$1);
  h$1 = this.mixLast__I__I__I(h$1, c.elem$1);
  return this.finalizeHash__I__I__I(h$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.productHash__s_Product__I__I = (function(x, seed) {
  var arr = x.productArity__I();
  if ((arr === 0)) {
    var this$1 = x.productPrefix__T();
    return $m_sjsr_RuntimeString$().hashCode__T__I(this$1)
  } else {
    var h = seed;
    var i = 0;
    while ((i < arr)) {
      h = this.mix__I__I__I(h, $m_sr_Statics$().anyHash__O__I(x.productElement__I__O(i)));
      i = ((1 + i) | 0)
    };
    return this.finalizeHash__I__I__I(h, arr)
  }
});
$c_s_util_hashing_MurmurHash3.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__p1__I__I((hash ^ length))
});
$c_s_util_hashing_MurmurHash3.prototype.orderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var n = new $c_sr_IntRef().init___I(0);
  var h = new $c_sr_IntRef().init___I(seed);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, n$1, h$1) {
    return (function(x$2) {
      h$1.elem$1 = $this.mix__I__I__I(h$1.elem$1, $m_sr_Statics$().anyHash__O__I(x$2));
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, n, h)));
  return this.finalizeHash__I__I__I(h.elem$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.listHash__sci_List__I__I = (function(xs, seed) {
  var n = 0;
  var h = seed;
  var elems = xs;
  while ((!elems.isEmpty__Z())) {
    var head = elems.head__O();
    var this$1 = elems;
    var tail = this$1.tail__sci_List();
    h = this.mix__I__I__I(h, $m_sr_Statics$().anyHash__O__I(head));
    n = ((1 + n) | 0);
    elems = tail
  };
  return this.finalizeHash__I__I__I(h, n)
});
/** @constructor */
function $c_sc_$colon$plus$() {
  $c_O.call(this)
}
$c_sc_$colon$plus$.prototype = new $h_O();
$c_sc_$colon$plus$.prototype.constructor = $c_sc_$colon$plus$;
/** @constructor */
function $h_sc_$colon$plus$() {
  /*<skip>*/
}
$h_sc_$colon$plus$.prototype = $c_sc_$colon$plus$.prototype;
$c_sc_$colon$plus$.prototype.init___ = (function() {
  return this
});
var $d_sc_$colon$plus$ = new $TypeData().initClass({
  sc_$colon$plus$: 0
}, false, "scala.collection.$colon$plus$", {
  sc_$colon$plus$: 1,
  O: 1
});
$c_sc_$colon$plus$.prototype.$classData = $d_sc_$colon$plus$;
var $n_sc_$colon$plus$ = (void 0);
function $m_sc_$colon$plus$() {
  if ((!$n_sc_$colon$plus$)) {
    $n_sc_$colon$plus$ = new $c_sc_$colon$plus$().init___()
  };
  return $n_sc_$colon$plus$
}
/** @constructor */
function $c_sc_$plus$colon$() {
  $c_O.call(this)
}
$c_sc_$plus$colon$.prototype = new $h_O();
$c_sc_$plus$colon$.prototype.constructor = $c_sc_$plus$colon$;
/** @constructor */
function $h_sc_$plus$colon$() {
  /*<skip>*/
}
$h_sc_$plus$colon$.prototype = $c_sc_$plus$colon$.prototype;
$c_sc_$plus$colon$.prototype.init___ = (function() {
  return this
});
var $d_sc_$plus$colon$ = new $TypeData().initClass({
  sc_$plus$colon$: 0
}, false, "scala.collection.$plus$colon$", {
  sc_$plus$colon$: 1,
  O: 1
});
$c_sc_$plus$colon$.prototype.$classData = $d_sc_$plus$colon$;
var $n_sc_$plus$colon$ = (void 0);
function $m_sc_$plus$colon$() {
  if ((!$n_sc_$plus$colon$)) {
    $n_sc_$plus$colon$ = new $c_sc_$plus$colon$().init___()
  };
  return $n_sc_$plus$colon$
}
/** @constructor */
function $c_sc_Iterator$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_sc_Iterator$.prototype = new $h_O();
$c_sc_Iterator$.prototype.constructor = $c_sc_Iterator$;
/** @constructor */
function $h_sc_Iterator$() {
  /*<skip>*/
}
$h_sc_Iterator$.prototype = $c_sc_Iterator$.prototype;
$c_sc_Iterator$.prototype.init___ = (function() {
  $n_sc_Iterator$ = this;
  this.empty$1 = new $c_sc_Iterator$$anon$2().init___();
  return this
});
var $d_sc_Iterator$ = new $TypeData().initClass({
  sc_Iterator$: 0
}, false, "scala.collection.Iterator$", {
  sc_Iterator$: 1,
  O: 1
});
$c_sc_Iterator$.prototype.$classData = $d_sc_Iterator$;
var $n_sc_Iterator$ = (void 0);
function $m_sc_Iterator$() {
  if ((!$n_sc_Iterator$)) {
    $n_sc_Iterator$ = new $c_sc_Iterator$().init___()
  };
  return $n_sc_Iterator$
}
function $f_sc_TraversableOnce__copyToArray__O__I__V($thiz, xs, start) {
  $thiz.copyToArray__O__I__I__V(xs, start, (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0))
}
function $f_sc_TraversableOnce__to__scg_CanBuildFrom__O($thiz, cbf) {
  var b = cbf.apply__scm_Builder();
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($thiz.seq__sc_TraversableOnce());
  return b.result__O()
}
function $f_sc_TraversableOnce__mkString__T__T__T__T($thiz, start, sep, end) {
  var this$1 = $thiz.addString__scm_StringBuilder__T__T__T__scm_StringBuilder(new $c_scm_StringBuilder().init___(), start, sep, end);
  return this$1.underlying$5.java$lang$StringBuilder$$content$f
}
function $f_sc_TraversableOnce__size__I($thiz) {
  var result = new $c_sr_IntRef().init___I(0);
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, result$1) {
    return (function(x$2) {
      result$1.elem$1 = ((1 + result$1.elem$1) | 0)
    })
  })($thiz, result)));
  return result.elem$1
}
function $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder($thiz, b, start, sep, end) {
  var first = new $c_sr_BooleanRef().init___Z(true);
  b.append__T__scm_StringBuilder(start);
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, b$1, sep$1, first$1) {
    return (function(x$2) {
      if (first$1.elem$1) {
        b$1.append__O__scm_StringBuilder(x$2);
        first$1.elem$1 = false;
        return (void 0)
      } else {
        b$1.append__T__scm_StringBuilder(sep$1);
        return b$1.append__O__scm_StringBuilder(x$2)
      }
    })
  })($thiz, b, sep, first)));
  b.append__T__scm_StringBuilder(end);
  return b
}
function $f_sc_TraversableOnce__max__s_math_Ordering__O($thiz, cmp) {
  if ($thiz.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.max")
  };
  return $thiz.reduceLeft__F2__O(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, cmp$1) {
    return (function(x$2, y$2) {
      return ($f_s_math_Ordering__gteq__O__O__Z(cmp$1, x$2, y$2) ? x$2 : y$2)
    })
  })($thiz, cmp)))
}
function $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O($thiz, evidence$1) {
  if ($thiz.isTraversableAgain__Z()) {
    var result = evidence$1.newArray__I__O($thiz.size__I());
    $thiz.copyToArray__O__I__V(result, 0);
    return result
  } else {
    return $thiz.toBuffer__scm_Buffer().toArray__s_reflect_ClassTag__O(evidence$1)
  }
}
function $f_sc_TraversableOnce__nonEmpty__Z($thiz) {
  return (!$thiz.isEmpty__Z())
}
function $f_sc_TraversableOnce__reduceLeft__F2__O($thiz, op) {
  if ($thiz.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.reduceLeft")
  };
  var first = new $c_sr_BooleanRef().init___Z(true);
  var acc = new $c_sr_ObjectRef().init___O(0);
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, op$1, first$1, acc$1) {
    return (function(x$2) {
      if (first$1.elem$1) {
        acc$1.elem$1 = x$2;
        first$1.elem$1 = false
      } else {
        acc$1.elem$1 = op$1.apply__O__O__O(acc$1.elem$1, x$2)
      }
    })
  })($thiz, op, first, acc)));
  return acc.elem$1
}
function $is_sc_TraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableOnce)))
}
function $as_sc_TraversableOnce(obj) {
  return (($is_sc_TraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableOnce"))
}
function $isArrayOf_sc_TraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableOnce)))
}
function $asArrayOf_sc_TraversableOnce(obj, depth) {
  return (($isArrayOf_sc_TraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableOnce;", depth))
}
/** @constructor */
function $c_scg_GenericCompanion() {
  $c_O.call(this)
}
$c_scg_GenericCompanion.prototype = new $h_O();
$c_scg_GenericCompanion.prototype.constructor = $c_scg_GenericCompanion;
/** @constructor */
function $h_scg_GenericCompanion() {
  /*<skip>*/
}
$h_scg_GenericCompanion.prototype = $c_scg_GenericCompanion.prototype;
$c_scg_GenericCompanion.prototype.apply__sc_Seq__sc_GenTraversable = (function(elems) {
  if (elems.isEmpty__Z()) {
    return this.empty__sc_GenTraversable()
  } else {
    var b = this.newBuilder__scm_Builder();
    b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(elems);
    return $as_sc_GenTraversable(b.result__O())
  }
});
$c_scg_GenericCompanion.prototype.empty__sc_GenTraversable = (function() {
  return $as_sc_GenTraversable(this.newBuilder__scm_Builder().result__O())
});
function $f_scg_Growable__loop$1__pscg_Growable__sc_LinearSeq__V($thiz, xs) {
  _loop: while (true) {
    var this$1 = xs;
    if ($f_sc_TraversableOnce__nonEmpty__Z(this$1)) {
      $thiz.$$plus$eq__O__scg_Growable(xs.head__O());
      xs = $as_sc_LinearSeq(xs.tail__O());
      continue _loop
    };
    break
  }
}
function $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable($thiz, xs) {
  if ($is_sc_LinearSeq(xs)) {
    var x2 = $as_sc_LinearSeq(xs);
    var xs$1 = x2;
    $f_scg_Growable__loop$1__pscg_Growable__sc_LinearSeq__V($thiz, xs$1)
  } else {
    xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
      return (function(elem$2) {
        return $this.$$plus$eq__O__scg_Growable(elem$2)
      })
    })($thiz)))
  };
  return $thiz
}
/** @constructor */
function $c_sci_Stream$$hash$colon$colon$() {
  $c_O.call(this)
}
$c_sci_Stream$$hash$colon$colon$.prototype = new $h_O();
$c_sci_Stream$$hash$colon$colon$.prototype.constructor = $c_sci_Stream$$hash$colon$colon$;
/** @constructor */
function $h_sci_Stream$$hash$colon$colon$() {
  /*<skip>*/
}
$h_sci_Stream$$hash$colon$colon$.prototype = $c_sci_Stream$$hash$colon$colon$.prototype;
$c_sci_Stream$$hash$colon$colon$.prototype.init___ = (function() {
  return this
});
var $d_sci_Stream$$hash$colon$colon$ = new $TypeData().initClass({
  sci_Stream$$hash$colon$colon$: 0
}, false, "scala.collection.immutable.Stream$$hash$colon$colon$", {
  sci_Stream$$hash$colon$colon$: 1,
  O: 1
});
$c_sci_Stream$$hash$colon$colon$.prototype.$classData = $d_sci_Stream$$hash$colon$colon$;
var $n_sci_Stream$$hash$colon$colon$ = (void 0);
function $m_sci_Stream$$hash$colon$colon$() {
  if ((!$n_sci_Stream$$hash$colon$colon$)) {
    $n_sci_Stream$$hash$colon$colon$ = new $c_sci_Stream$$hash$colon$colon$().init___()
  };
  return $n_sci_Stream$$hash$colon$colon$
}
/** @constructor */
function $c_sci_StreamIterator$LazyCell() {
  $c_O.call(this);
  this.v$1 = null;
  this.st$1 = null;
  this.bitmap$0$1 = false;
  this.$$outer$1 = null
}
$c_sci_StreamIterator$LazyCell.prototype = new $h_O();
$c_sci_StreamIterator$LazyCell.prototype.constructor = $c_sci_StreamIterator$LazyCell;
/** @constructor */
function $h_sci_StreamIterator$LazyCell() {
  /*<skip>*/
}
$h_sci_StreamIterator$LazyCell.prototype = $c_sci_StreamIterator$LazyCell.prototype;
$c_sci_StreamIterator$LazyCell.prototype.init___sci_StreamIterator__F0 = (function($$outer, st) {
  this.st$1 = st;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
$c_sci_StreamIterator$LazyCell.prototype.v$lzycompute__p1__sci_Stream = (function() {
  if ((!this.bitmap$0$1)) {
    this.v$1 = $as_sci_Stream(this.st$1.apply__O());
    this.bitmap$0$1 = true
  };
  this.st$1 = null;
  return this.v$1
});
$c_sci_StreamIterator$LazyCell.prototype.v__sci_Stream = (function() {
  return ((!this.bitmap$0$1) ? this.v$lzycompute__p1__sci_Stream() : this.v$1)
});
var $d_sci_StreamIterator$LazyCell = new $TypeData().initClass({
  sci_StreamIterator$LazyCell: 0
}, false, "scala.collection.immutable.StreamIterator$LazyCell", {
  sci_StreamIterator$LazyCell: 1,
  O: 1
});
$c_sci_StreamIterator$LazyCell.prototype.$classData = $d_sci_StreamIterator$LazyCell;
/** @constructor */
function $c_sci_StringOps$() {
  $c_O.call(this)
}
$c_sci_StringOps$.prototype = new $h_O();
$c_sci_StringOps$.prototype.constructor = $c_sci_StringOps$;
/** @constructor */
function $h_sci_StringOps$() {
  /*<skip>*/
}
$h_sci_StringOps$.prototype = $c_sci_StringOps$.prototype;
$c_sci_StringOps$.prototype.init___ = (function() {
  return this
});
$c_sci_StringOps$.prototype.equals$extension__T__O__Z = (function($$this, x$1) {
  if ($is_sci_StringOps(x$1)) {
    var StringOps$1 = ((x$1 === null) ? null : $as_sci_StringOps(x$1).repr$1);
    return ($$this === StringOps$1)
  } else {
    return false
  }
});
var $d_sci_StringOps$ = new $TypeData().initClass({
  sci_StringOps$: 0
}, false, "scala.collection.immutable.StringOps$", {
  sci_StringOps$: 1,
  O: 1
});
$c_sci_StringOps$.prototype.$classData = $d_sci_StringOps$;
var $n_sci_StringOps$ = (void 0);
function $m_sci_StringOps$() {
  if ((!$n_sci_StringOps$)) {
    $n_sci_StringOps$ = new $c_sci_StringOps$().init___()
  };
  return $n_sci_StringOps$
}
/** @constructor */
function $c_sci_WrappedString$() {
  $c_O.call(this)
}
$c_sci_WrappedString$.prototype = new $h_O();
$c_sci_WrappedString$.prototype.constructor = $c_sci_WrappedString$;
/** @constructor */
function $h_sci_WrappedString$() {
  /*<skip>*/
}
$h_sci_WrappedString$.prototype = $c_sci_WrappedString$.prototype;
$c_sci_WrappedString$.prototype.init___ = (function() {
  return this
});
$c_sci_WrappedString$.prototype.newBuilder__scm_Builder = (function() {
  var this$2 = new $c_scm_StringBuilder().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$2) {
      var x = $as_T(x$2);
      return new $c_sci_WrappedString().init___T(x)
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$2, f)
});
var $d_sci_WrappedString$ = new $TypeData().initClass({
  sci_WrappedString$: 0
}, false, "scala.collection.immutable.WrappedString$", {
  sci_WrappedString$: 1,
  O: 1
});
$c_sci_WrappedString$.prototype.$classData = $d_sci_WrappedString$;
var $n_sci_WrappedString$ = (void 0);
function $m_sci_WrappedString$() {
  if ((!$n_sci_WrappedString$)) {
    $n_sci_WrappedString$ = new $c_sci_WrappedString$().init___()
  };
  return $n_sci_WrappedString$
}
/** @constructor */
function $c_sjs_js_ArrayOpsCommon$() {
  $c_O.call(this)
}
$c_sjs_js_ArrayOpsCommon$.prototype = new $h_O();
$c_sjs_js_ArrayOpsCommon$.prototype.constructor = $c_sjs_js_ArrayOpsCommon$;
/** @constructor */
function $h_sjs_js_ArrayOpsCommon$() {
  /*<skip>*/
}
$h_sjs_js_ArrayOpsCommon$.prototype = $c_sjs_js_ArrayOpsCommon$.prototype;
$c_sjs_js_ArrayOpsCommon$.prototype.init___ = (function() {
  return this
});
$c_sjs_js_ArrayOpsCommon$.prototype.throwUnsupported__p1__T__sr_Nothing$ = (function(msg) {
  throw new $c_jl_UnsupportedOperationException().init___T(msg)
});
$c_sjs_js_ArrayOpsCommon$.prototype.reduceLeft__sjs_js_Array__F2__O = (function(array, op) {
  var length = $uI(array.length);
  if ((length <= 0)) {
    this.throwUnsupported__p1__T__sr_Nothing$("empty.reduceLeft")
  };
  var start = 1;
  var z = array[0];
  _loop: while (true) {
    if ((start === length)) {
      return z
    } else {
      var temp$start = ((1 + start) | 0);
      var temp$z = op.apply__O__O__O(z, array[start]);
      start = temp$start;
      z = temp$z;
      continue _loop
    }
  }
});
var $d_sjs_js_ArrayOpsCommon$ = new $TypeData().initClass({
  sjs_js_ArrayOpsCommon$: 0
}, false, "scala.scalajs.js.ArrayOpsCommon$", {
  sjs_js_ArrayOpsCommon$: 1,
  O: 1
});
$c_sjs_js_ArrayOpsCommon$.prototype.$classData = $d_sjs_js_ArrayOpsCommon$;
var $n_sjs_js_ArrayOpsCommon$ = (void 0);
function $m_sjs_js_ArrayOpsCommon$() {
  if ((!$n_sjs_js_ArrayOpsCommon$)) {
    $n_sjs_js_ArrayOpsCommon$ = new $c_sjs_js_ArrayOpsCommon$().init___()
  };
  return $n_sjs_js_ArrayOpsCommon$
}
/** @constructor */
function $c_sjs_js_Dictionary$() {
  $c_O.call(this)
}
$c_sjs_js_Dictionary$.prototype = new $h_O();
$c_sjs_js_Dictionary$.prototype.constructor = $c_sjs_js_Dictionary$;
/** @constructor */
function $h_sjs_js_Dictionary$() {
  /*<skip>*/
}
$h_sjs_js_Dictionary$.prototype = $c_sjs_js_Dictionary$.prototype;
$c_sjs_js_Dictionary$.prototype.init___ = (function() {
  return this
});
$c_sjs_js_Dictionary$.prototype.apply__sc_Seq__sjs_js_Dictionary = (function(properties) {
  var result = {};
  properties.withFilter__F1__scg_FilterMonadic(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(check$ifrefutable$1$2) {
      var check$ifrefutable$1 = $as_T2(check$ifrefutable$1$2);
      return (check$ifrefutable$1 !== null)
    })
  })(this))).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(this$2, result$1) {
    return (function(x$1$2) {
      var x$1 = $as_T2(x$1$2);
      if ((x$1 !== null)) {
        var key = $as_T(x$1.$$und1$f);
        var value = x$1.$$und2$f;
        result$1[key] = value
      } else {
        throw new $c_s_MatchError().init___O(x$1)
      }
    })
  })(this, result)));
  return result
});
var $d_sjs_js_Dictionary$ = new $TypeData().initClass({
  sjs_js_Dictionary$: 0
}, false, "scala.scalajs.js.Dictionary$", {
  sjs_js_Dictionary$: 1,
  O: 1
});
$c_sjs_js_Dictionary$.prototype.$classData = $d_sjs_js_Dictionary$;
var $n_sjs_js_Dictionary$ = (void 0);
function $m_sjs_js_Dictionary$() {
  if ((!$n_sjs_js_Dictionary$)) {
    $n_sjs_js_Dictionary$ = new $c_sjs_js_Dictionary$().init___()
  };
  return $n_sjs_js_Dictionary$
}
/** @constructor */
function $c_sjs_js_WrappedDictionary$Cache$() {
  $c_O.call(this);
  this.safeHasOwnProperty$1 = null
}
$c_sjs_js_WrappedDictionary$Cache$.prototype = new $h_O();
$c_sjs_js_WrappedDictionary$Cache$.prototype.constructor = $c_sjs_js_WrappedDictionary$Cache$;
/** @constructor */
function $h_sjs_js_WrappedDictionary$Cache$() {
  /*<skip>*/
}
$h_sjs_js_WrappedDictionary$Cache$.prototype = $c_sjs_js_WrappedDictionary$Cache$.prototype;
$c_sjs_js_WrappedDictionary$Cache$.prototype.init___ = (function() {
  $n_sjs_js_WrappedDictionary$Cache$ = this;
  this.safeHasOwnProperty$1 = $g.Object.prototype.hasOwnProperty;
  return this
});
var $d_sjs_js_WrappedDictionary$Cache$ = new $TypeData().initClass({
  sjs_js_WrappedDictionary$Cache$: 0
}, false, "scala.scalajs.js.WrappedDictionary$Cache$", {
  sjs_js_WrappedDictionary$Cache$: 1,
  O: 1
});
$c_sjs_js_WrappedDictionary$Cache$.prototype.$classData = $d_sjs_js_WrappedDictionary$Cache$;
var $n_sjs_js_WrappedDictionary$Cache$ = (void 0);
function $m_sjs_js_WrappedDictionary$Cache$() {
  if ((!$n_sjs_js_WrappedDictionary$Cache$)) {
    $n_sjs_js_WrappedDictionary$Cache$ = new $c_sjs_js_WrappedDictionary$Cache$().init___()
  };
  return $n_sjs_js_WrappedDictionary$Cache$
}
/** @constructor */
function $c_sjsr_Bits$() {
  $c_O.call(this);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = false;
  this.arrayBuffer$1 = null;
  this.int32Array$1 = null;
  this.float32Array$1 = null;
  this.float64Array$1 = null;
  this.areTypedArraysBigEndian$1 = false;
  this.highOffset$1 = 0;
  this.lowOffset$1 = 0
}
$c_sjsr_Bits$.prototype = new $h_O();
$c_sjsr_Bits$.prototype.constructor = $c_sjsr_Bits$;
/** @constructor */
function $h_sjsr_Bits$() {
  /*<skip>*/
}
$h_sjsr_Bits$.prototype = $c_sjsr_Bits$.prototype;
$c_sjsr_Bits$.prototype.init___ = (function() {
  $n_sjsr_Bits$ = this;
  var x = ((($g.ArrayBuffer && $g.Int32Array) && $g.Float32Array) && $g.Float64Array);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = $uZ((!(!x)));
  this.arrayBuffer$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.ArrayBuffer(8) : null);
  this.int32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Int32Array(this.arrayBuffer$1, 0, 2) : null);
  this.float32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Float32Array(this.arrayBuffer$1, 0, 2) : null);
  this.float64Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Float64Array(this.arrayBuffer$1, 0, 1) : null);
  if ((!this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f)) {
    var jsx$1 = true
  } else {
    this.int32Array$1[0] = 16909060;
    var jsx$1 = ($uB(new $g.Int8Array(this.arrayBuffer$1, 0, 8)[0]) === 1)
  };
  this.areTypedArraysBigEndian$1 = jsx$1;
  this.highOffset$1 = (this.areTypedArraysBigEndian$1 ? 0 : 1);
  this.lowOffset$1 = (this.areTypedArraysBigEndian$1 ? 1 : 0);
  return this
});
$c_sjsr_Bits$.prototype.numberHashCode__D__I = (function(value) {
  var iv = $uI((value | 0));
  if (((iv === value) && ((1.0 / value) !== (-Infinity)))) {
    return iv
  } else {
    var t = this.doubleToLongBits__D__J(value);
    var lo = t.lo$2;
    var hi = t.hi$2;
    return (lo ^ hi)
  }
});
$c_sjsr_Bits$.prototype.doubleToLongBitsPolyfill__p1__D__J = (function(value) {
  if ((value !== value)) {
    var _3 = $uD($g.Math.pow(2.0, 51));
    var x1_$_$$und1$1 = false;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = _3
  } else if (((value === Infinity) || (value === (-Infinity)))) {
    var _1 = (value < 0);
    var x1_$_$$und1$1 = _1;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = 0.0
  } else if ((value === 0.0)) {
    var _1$1 = ((1 / value) === (-Infinity));
    var x1_$_$$und1$1 = _1$1;
    var x1_$_$$und2$1 = 0;
    var x1_$_$$und3$1 = 0.0
  } else {
    var s = (value < 0);
    var av = (s ? (-value) : value);
    if ((av >= $uD($g.Math.pow(2.0, (-1022))))) {
      var twoPowFbits = $uD($g.Math.pow(2.0, 52));
      var a = ($uD($g.Math.log(av)) / 0.6931471805599453);
      var x = $uD($g.Math.floor(a));
      var a$1 = $uI((x | 0));
      var e = ((a$1 < 1023) ? a$1 : 1023);
      var b = e;
      var twoPowE = $uD($g.Math.pow(2.0, b));
      if ((twoPowE > av)) {
        e = (((-1) + e) | 0);
        twoPowE = (twoPowE / 2)
      };
      var n = ((av / twoPowE) * twoPowFbits);
      var w = $uD($g.Math.floor(n));
      var f = (n - w);
      var f$1 = ((f < 0.5) ? w : ((f > 0.5) ? (1 + w) : (((w % 2) !== 0) ? (1 + w) : w)));
      if (((f$1 / twoPowFbits) >= 2)) {
        e = ((1 + e) | 0);
        f$1 = 1.0
      };
      if ((e > 1023)) {
        e = 2047;
        f$1 = 0.0
      } else {
        e = ((1023 + e) | 0);
        f$1 = (f$1 - twoPowFbits)
      };
      var _2 = e;
      var _3$1 = f$1;
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = _2;
      var x1_$_$$und3$1 = _3$1
    } else {
      var n$1 = (av / $uD($g.Math.pow(2.0, (-1074))));
      var w$1 = $uD($g.Math.floor(n$1));
      var f$2 = (n$1 - w$1);
      var _3$2 = ((f$2 < 0.5) ? w$1 : ((f$2 > 0.5) ? (1 + w$1) : (((w$1 % 2) !== 0) ? (1 + w$1) : w$1)));
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = 0;
      var x1_$_$$und3$1 = _3$2
    }
  };
  var s$1 = $uZ(x1_$_$$und1$1);
  var e$1 = $uI(x1_$_$$und2$1);
  var f$3 = $uD(x1_$_$$und3$1);
  var x$1 = (f$3 / 4.294967296E9);
  var hif = $uI((x$1 | 0));
  var hi = (((s$1 ? (-2147483648) : 0) | (e$1 << 20)) | hif);
  var lo = $uI((f$3 | 0));
  return new $c_sjsr_RuntimeLong().init___I__I(lo, hi)
});
$c_sjsr_Bits$.prototype.doubleToLongBits__D__J = (function(value) {
  if (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f) {
    this.float64Array$1[0] = value;
    var value$1 = $uI(this.int32Array$1[this.highOffset$1]);
    var value$2 = $uI(this.int32Array$1[this.lowOffset$1]);
    return new $c_sjsr_RuntimeLong().init___I__I(value$2, value$1)
  } else {
    return this.doubleToLongBitsPolyfill__p1__D__J(value)
  }
});
var $d_sjsr_Bits$ = new $TypeData().initClass({
  sjsr_Bits$: 0
}, false, "scala.scalajs.runtime.Bits$", {
  sjsr_Bits$: 1,
  O: 1
});
$c_sjsr_Bits$.prototype.$classData = $d_sjsr_Bits$;
var $n_sjsr_Bits$ = (void 0);
function $m_sjsr_Bits$() {
  if ((!$n_sjsr_Bits$)) {
    $n_sjsr_Bits$ = new $c_sjsr_Bits$().init___()
  };
  return $n_sjsr_Bits$
}
/** @constructor */
function $c_sjsr_Compat$() {
  $c_O.call(this)
}
$c_sjsr_Compat$.prototype = new $h_O();
$c_sjsr_Compat$.prototype.constructor = $c_sjsr_Compat$;
/** @constructor */
function $h_sjsr_Compat$() {
  /*<skip>*/
}
$h_sjsr_Compat$.prototype = $c_sjsr_Compat$.prototype;
$c_sjsr_Compat$.prototype.init___ = (function() {
  return this
});
var $d_sjsr_Compat$ = new $TypeData().initClass({
  sjsr_Compat$: 0
}, false, "scala.scalajs.runtime.Compat$", {
  sjsr_Compat$: 1,
  O: 1
});
$c_sjsr_Compat$.prototype.$classData = $d_sjsr_Compat$;
var $n_sjsr_Compat$ = (void 0);
function $m_sjsr_Compat$() {
  if ((!$n_sjsr_Compat$)) {
    $n_sjsr_Compat$ = new $c_sjsr_Compat$().init___()
  };
  return $n_sjsr_Compat$
}
/** @constructor */
function $c_sjsr_RuntimeString$() {
  $c_O.call(this);
  this.CASE$undINSENSITIVE$undORDER$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_RuntimeString$.prototype = new $h_O();
$c_sjsr_RuntimeString$.prototype.constructor = $c_sjsr_RuntimeString$;
/** @constructor */
function $h_sjsr_RuntimeString$() {
  /*<skip>*/
}
$h_sjsr_RuntimeString$.prototype = $c_sjsr_RuntimeString$.prototype;
$c_sjsr_RuntimeString$.prototype.init___ = (function() {
  return this
});
$c_sjsr_RuntimeString$.prototype.split__T__T__I__AT = (function(thiz, regex, limit) {
  if ((thiz === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  var this$1 = $m_ju_regex_Pattern$();
  return this$1.compile__T__I__ju_regex_Pattern(regex, 0).split__jl_CharSequence__I__AT(thiz, limit)
});
$c_sjsr_RuntimeString$.prototype.toCharArray__T__AC = (function(thiz) {
  var length = $uI(thiz.length);
  var result = $newArrayObject($d_C.getArrayOf(), [length]);
  var i = 0;
  while ((i < length)) {
    var jsx$1 = i;
    var index = i;
    result.set(jsx$1, (65535 & $uI(thiz.charCodeAt(index))));
    i = ((1 + i) | 0)
  };
  return result
});
$c_sjsr_RuntimeString$.prototype.hashCode__T__I = (function(thiz) {
  var res = 0;
  var mul = 1;
  var i = (((-1) + $uI(thiz.length)) | 0);
  while ((i >= 0)) {
    var jsx$1 = res;
    var index = i;
    res = ((jsx$1 + $imul((65535 & $uI(thiz.charCodeAt(index))), mul)) | 0);
    mul = $imul(31, mul);
    i = (((-1) + i) | 0)
  };
  return res
});
$c_sjsr_RuntimeString$.prototype.format__T__AO__T = (function(format, args) {
  var frm = new $c_ju_Formatter().init___();
  var res = frm.format__T__AO__ju_Formatter(format, args).toString__T();
  frm.close__V();
  return res
});
$c_sjsr_RuntimeString$.prototype.replaceAll__T__T__T__T = (function(thiz, regex, replacement) {
  if ((thiz === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  var this$1 = $m_ju_regex_Pattern$();
  var this$2 = this$1.compile__T__I__ju_regex_Pattern(regex, 0);
  return new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this$2, thiz, 0, $uI(thiz.length)).replaceAll__T__T(replacement)
});
var $d_sjsr_RuntimeString$ = new $TypeData().initClass({
  sjsr_RuntimeString$: 0
}, false, "scala.scalajs.runtime.RuntimeString$", {
  sjsr_RuntimeString$: 1,
  O: 1
});
$c_sjsr_RuntimeString$.prototype.$classData = $d_sjsr_RuntimeString$;
var $n_sjsr_RuntimeString$ = (void 0);
function $m_sjsr_RuntimeString$() {
  if ((!$n_sjsr_RuntimeString$)) {
    $n_sjsr_RuntimeString$ = new $c_sjsr_RuntimeString$().init___()
  };
  return $n_sjsr_RuntimeString$
}
/** @constructor */
function $c_sjsr_package$() {
  $c_O.call(this)
}
$c_sjsr_package$.prototype = new $h_O();
$c_sjsr_package$.prototype.constructor = $c_sjsr_package$;
/** @constructor */
function $h_sjsr_package$() {
  /*<skip>*/
}
$h_sjsr_package$.prototype = $c_sjsr_package$.prototype;
$c_sjsr_package$.prototype.init___ = (function() {
  return this
});
$c_sjsr_package$.prototype.unwrapJavaScriptException__jl_Throwable__O = (function(th) {
  if ($is_sjs_js_JavaScriptException(th)) {
    var x2 = $as_sjs_js_JavaScriptException(th);
    var e = x2.exception$4;
    return e
  } else {
    return th
  }
});
$c_sjsr_package$.prototype.wrapJavaScriptException__O__jl_Throwable = (function(e) {
  if ($is_jl_Throwable(e)) {
    var x2 = $as_jl_Throwable(e);
    return x2
  } else {
    return new $c_sjs_js_JavaScriptException().init___O(e)
  }
});
var $d_sjsr_package$ = new $TypeData().initClass({
  sjsr_package$: 0
}, false, "scala.scalajs.runtime.package$", {
  sjsr_package$: 1,
  O: 1
});
$c_sjsr_package$.prototype.$classData = $d_sjsr_package$;
var $n_sjsr_package$ = (void 0);
function $m_sjsr_package$() {
  if ((!$n_sjsr_package$)) {
    $n_sjsr_package$ = new $c_sjsr_package$().init___()
  };
  return $n_sjsr_package$
}
/** @constructor */
function $c_sr_BoxesRunTime$() {
  $c_O.call(this)
}
$c_sr_BoxesRunTime$.prototype = new $h_O();
$c_sr_BoxesRunTime$.prototype.constructor = $c_sr_BoxesRunTime$;
/** @constructor */
function $h_sr_BoxesRunTime$() {
  /*<skip>*/
}
$h_sr_BoxesRunTime$.prototype = $c_sr_BoxesRunTime$.prototype;
$c_sr_BoxesRunTime$.prototype.init___ = (function() {
  return this
});
$c_sr_BoxesRunTime$.prototype.equalsCharObject__jl_Character__O__Z = (function(xc, y) {
  if ($is_jl_Character(y)) {
    var x2 = $as_jl_Character(y);
    return (xc.value$1 === x2.value$1)
  } else if ($is_jl_Number(y)) {
    var x3 = $as_jl_Number(y);
    if (((typeof x3) === "number")) {
      var x2$1 = $uD(x3);
      return (x2$1 === xc.value$1)
    } else if ($is_sjsr_RuntimeLong(x3)) {
      var t = $uJ(x3);
      var lo = t.lo$2;
      var hi = t.hi$2;
      var value = xc.value$1;
      var hi$1 = (value >> 31);
      return ((lo === value) && (hi === hi$1))
    } else {
      return ((x3 === null) ? (xc === null) : $objectEquals(x3, xc))
    }
  } else {
    return ((xc === null) && (y === null))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumObject__jl_Number__O__Z = (function(xn, y) {
  if ($is_jl_Number(y)) {
    var x2 = $as_jl_Number(y);
    return this.equalsNumNum__jl_Number__jl_Number__Z(xn, x2)
  } else if ($is_jl_Character(y)) {
    var x3 = $as_jl_Character(y);
    if (((typeof xn) === "number")) {
      var x2$1 = $uD(xn);
      return (x2$1 === x3.value$1)
    } else if ($is_sjsr_RuntimeLong(xn)) {
      var t = $uJ(xn);
      var lo = t.lo$2;
      var hi = t.hi$2;
      var value = x3.value$1;
      var hi$1 = (value >> 31);
      return ((lo === value) && (hi === hi$1))
    } else {
      return ((xn === null) ? (x3 === null) : $objectEquals(xn, x3))
    }
  } else {
    return ((xn === null) ? (y === null) : $objectEquals(xn, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equals__O__O__Z = (function(x, y) {
  if ((x === y)) {
    return true
  } else if ($is_jl_Number(x)) {
    var x2 = $as_jl_Number(x);
    return this.equalsNumObject__jl_Number__O__Z(x2, y)
  } else if ($is_jl_Character(x)) {
    var x3 = $as_jl_Character(x);
    return this.equalsCharObject__jl_Character__O__Z(x3, y)
  } else {
    return ((x === null) ? (y === null) : $objectEquals(x, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumNum__jl_Number__jl_Number__Z = (function(xn, yn) {
  if (((typeof xn) === "number")) {
    var x2 = $uD(xn);
    if (((typeof yn) === "number")) {
      var x2$2 = $uD(yn);
      return (x2 === x2$2)
    } else if ($is_sjsr_RuntimeLong(yn)) {
      var t = $uJ(yn);
      var lo = t.lo$2;
      var hi = t.hi$2;
      return (x2 === $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo, hi))
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4 = $as_s_math_ScalaNumber(yn);
      return x4.equals__O__Z(x2)
    } else {
      return false
    }
  } else if ($is_sjsr_RuntimeLong(xn)) {
    var t$1 = $uJ(xn);
    var lo$1 = t$1.lo$2;
    var hi$1 = t$1.hi$2;
    if ($is_sjsr_RuntimeLong(yn)) {
      var t$2 = $uJ(yn);
      var lo$2 = t$2.lo$2;
      var hi$2 = t$2.hi$2;
      return ((lo$1 === lo$2) && (hi$1 === hi$2))
    } else if (((typeof yn) === "number")) {
      var x3$3 = $uD(yn);
      return ($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo$1, hi$1) === x3$3)
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4$2 = $as_s_math_ScalaNumber(yn);
      return x4$2.equals__O__Z(new $c_sjsr_RuntimeLong().init___I__I(lo$1, hi$1))
    } else {
      return false
    }
  } else {
    return ((xn === null) ? (yn === null) : $objectEquals(xn, yn))
  }
});
var $d_sr_BoxesRunTime$ = new $TypeData().initClass({
  sr_BoxesRunTime$: 0
}, false, "scala.runtime.BoxesRunTime$", {
  sr_BoxesRunTime$: 1,
  O: 1
});
$c_sr_BoxesRunTime$.prototype.$classData = $d_sr_BoxesRunTime$;
var $n_sr_BoxesRunTime$ = (void 0);
function $m_sr_BoxesRunTime$() {
  if ((!$n_sr_BoxesRunTime$)) {
    $n_sr_BoxesRunTime$ = new $c_sr_BoxesRunTime$().init___()
  };
  return $n_sr_BoxesRunTime$
}
/** @constructor */
function $c_sr_ScalaRunTime$() {
  $c_O.call(this)
}
$c_sr_ScalaRunTime$.prototype = new $h_O();
$c_sr_ScalaRunTime$.prototype.constructor = $c_sr_ScalaRunTime$;
/** @constructor */
function $h_sr_ScalaRunTime$() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$.prototype = $c_sr_ScalaRunTime$.prototype;
$c_sr_ScalaRunTime$.prototype.init___ = (function() {
  return this
});
$c_sr_ScalaRunTime$.prototype.array$undlength__O__I = (function(xs) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u.length
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u.length
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u.length
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u.length
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u.length
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    return x7.u.length
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u.length
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u.length
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u.length
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u.length
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.array$undupdate__O__I__O__V = (function(xs, idx, value) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    x2.set(idx, value)
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    x3.set(idx, $uI(value))
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    x4.set(idx, $uD(value))
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    x5.set(idx, $uJ(value))
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    x6.set(idx, $uF(value))
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    if ((value === null)) {
      var jsx$1 = 0
    } else {
      var this$2 = $as_jl_Character(value);
      var jsx$1 = this$2.value$1
    };
    x7.set(idx, jsx$1)
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    x8.set(idx, $uB(value))
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    x9.set(idx, $uS(value))
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    x10.set(idx, $uZ(value))
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    x11.set(idx, (void 0))
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.$$undtoString__s_Product__T = (function(x) {
  var this$1 = x.productIterator__sc_Iterator();
  var start = (x.productPrefix__T() + "(");
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this$1, start, ",", ")")
});
$c_sr_ScalaRunTime$.prototype.array$undapply__O__I__O = (function(xs, idx) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.get(idx)
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.get(idx)
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.get(idx)
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.get(idx)
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.get(idx)
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    var c = x7.get(idx);
    return new $c_jl_Character().init___C(c)
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.get(idx)
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.get(idx)
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.get(idx)
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.get(idx)
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
var $d_sr_ScalaRunTime$ = new $TypeData().initClass({
  sr_ScalaRunTime$: 0
}, false, "scala.runtime.ScalaRunTime$", {
  sr_ScalaRunTime$: 1,
  O: 1
});
$c_sr_ScalaRunTime$.prototype.$classData = $d_sr_ScalaRunTime$;
var $n_sr_ScalaRunTime$ = (void 0);
function $m_sr_ScalaRunTime$() {
  if ((!$n_sr_ScalaRunTime$)) {
    $n_sr_ScalaRunTime$ = new $c_sr_ScalaRunTime$().init___()
  };
  return $n_sr_ScalaRunTime$
}
/** @constructor */
function $c_sr_Statics$() {
  $c_O.call(this)
}
$c_sr_Statics$.prototype = new $h_O();
$c_sr_Statics$.prototype.constructor = $c_sr_Statics$;
/** @constructor */
function $h_sr_Statics$() {
  /*<skip>*/
}
$h_sr_Statics$.prototype = $c_sr_Statics$.prototype;
$c_sr_Statics$.prototype.init___ = (function() {
  return this
});
$c_sr_Statics$.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_sr_Statics$.prototype.doubleHash__D__I = (function(dv) {
  var iv = $doubleToInt(dv);
  if ((iv === dv)) {
    return iv
  } else {
    var this$1 = $m_sjsr_RuntimeLong$();
    var lo = this$1.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I(dv);
    var hi = this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
    return (($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo, hi) === dv) ? (lo ^ hi) : $m_sjsr_Bits$().numberHashCode__D__I(dv))
  }
});
$c_sr_Statics$.prototype.anyHash__O__I = (function(x) {
  if ((x === null)) {
    return 0
  } else if (((typeof x) === "number")) {
    var x3 = $uD(x);
    return this.doubleHash__D__I(x3)
  } else if ($is_sjsr_RuntimeLong(x)) {
    var t = $uJ(x);
    var lo = t.lo$2;
    var hi = t.hi$2;
    return this.longHash__J__I(new $c_sjsr_RuntimeLong().init___I__I(lo, hi))
  } else {
    return $objectHashCode(x)
  }
});
$c_sr_Statics$.prototype.avalanche__I__I = (function(h0) {
  var h = h0;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_sr_Statics$.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_sr_Statics$.prototype.longHash__J__I = (function(lv) {
  var lo = lv.lo$2;
  var lo$1 = lv.hi$2;
  return ((lo$1 === (lo >> 31)) ? lo : (lo ^ lo$1))
});
$c_sr_Statics$.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__I__I((hash ^ length))
});
var $d_sr_Statics$ = new $TypeData().initClass({
  sr_Statics$: 0
}, false, "scala.runtime.Statics$", {
  sr_Statics$: 1,
  O: 1
});
$c_sr_Statics$.prototype.$classData = $d_sr_Statics$;
var $n_sr_Statics$ = (void 0);
function $m_sr_Statics$() {
  if ((!$n_sr_Statics$)) {
    $n_sr_Statics$ = new $c_sr_Statics$().init___()
  };
  return $n_sr_Statics$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Nullary() {
  $c_Ljapgolly_scalajs_react_CtorType.call(this);
  this.unmodified$2 = null;
  this.construct$2 = null;
  this.mods$2 = null
}
$c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype = new $h_Ljapgolly_scalajs_react_CtorType();
$c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Nullary;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Nullary() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Nullary.prototype = $c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype.init___O__F1__sjs_js_UndefOr = (function(unmodified, construct, mods) {
  this.unmodified$2 = unmodified;
  this.construct$2 = construct;
  this.mods$2 = mods;
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype.apply__O = (function() {
  var value = this.mods$2;
  var f = this.construct$2;
  return ((value === (void 0)) ? this.unmodified$2 : f.apply__O__O(value))
});
function $is_Ljapgolly_scalajs_react_CtorType$Nullary(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CtorType$Nullary)))
}
function $as_Ljapgolly_scalajs_react_CtorType$Nullary(obj) {
  return (($is_Ljapgolly_scalajs_react_CtorType$Nullary(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CtorType$Nullary"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CtorType$Nullary(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CtorType$Nullary)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CtorType$Nullary(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CtorType$Nullary(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CtorType$Nullary;", depth))
}
var $d_Ljapgolly_scalajs_react_CtorType$Nullary = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Nullary: 0
}, false, "japgolly.scalajs.react.CtorType$Nullary", {
  Ljapgolly_scalajs_react_CtorType$Nullary: 1,
  Ljapgolly_scalajs_react_CtorType: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Nullary.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Nullary;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$ProfunctorF$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype;
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.rmap__Ljapgolly_scalajs_react_CtorType$PropsAndChildren__F1__Ljapgolly_scalajs_react_CtorType$PropsAndChildren = (function(ct, g) {
  var fn = ct.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren().init___F3__sjs_js_UndefOr(new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this, g$1, fn$1) {
    return (function(p$2, m$2, c$2) {
      var c = $as_sc_Seq(c$2);
      return g$1.apply__O__O(fn$1.apply__O__O__O__O(p$2, m$2, c))
    })
  })(this, g, fn)), ct.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.dimap__O__F1__F1__O = (function(f, l, r) {
  return this.dimap__Ljapgolly_scalajs_react_CtorType$PropsAndChildren__F1__F1__Ljapgolly_scalajs_react_CtorType$PropsAndChildren($as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(f), l, r)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.dimap__Ljapgolly_scalajs_react_CtorType$PropsAndChildren__F1__F1__Ljapgolly_scalajs_react_CtorType$PropsAndChildren = (function(ct, f, g) {
  var fn = ct.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren().init___F3__sjs_js_UndefOr(new $c_sjsr_AnonFunction3().init___sjs_js_Function3((function($this, f$1, g$1, fn$1) {
    return (function(p$2, m$2, c$2) {
      var c = $as_sc_Seq(c$2);
      return g$1.apply__O__O(fn$1.apply__O__O__O__O(f$1.apply__O__O(p$2), m$2, c))
    })
  })(this, f, g, fn)), ct.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.rmap__O__F1__O = (function(f, m) {
  return this.rmap__Ljapgolly_scalajs_react_CtorType$PropsAndChildren__F1__Ljapgolly_scalajs_react_CtorType$PropsAndChildren($as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(f), m)
});
var $d_Ljapgolly_scalajs_react_CtorType$ProfunctorF$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$ProfunctorF$: 0
}, false, "japgolly.scalajs.react.CtorType$ProfunctorF$", {
  Ljapgolly_scalajs_react_CtorType$ProfunctorF$: 1,
  O: 1,
  Ljapgolly_scalajs_react_internal_Profunctor: 1
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$ProfunctorF$;
var $n_Ljapgolly_scalajs_react_CtorType$ProfunctorF$ = (void 0);
function $m_Ljapgolly_scalajs_react_CtorType$ProfunctorF$() {
  if ((!$n_Ljapgolly_scalajs_react_CtorType$ProfunctorF$)) {
    $n_Ljapgolly_scalajs_react_CtorType$ProfunctorF$ = new $c_Ljapgolly_scalajs_react_CtorType$ProfunctorF$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CtorType$ProfunctorF$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$ProfunctorN$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype;
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.rmap__Ljapgolly_scalajs_react_CtorType$Nullary__F1__Ljapgolly_scalajs_react_CtorType$Nullary = (function(x, g) {
  var jsx$1 = g.apply__O__O(x.unmodified$2);
  var g$1 = x.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$Nullary().init___O__F1__sjs_js_UndefOr(jsx$1, $f_F1__compose__F1__F1(g, g$1), x.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.dimap__O__F1__F1__O = (function(f, l, r) {
  return this.dimap__Ljapgolly_scalajs_react_CtorType$Nullary__F1__F1__Ljapgolly_scalajs_react_CtorType$Nullary($as_Ljapgolly_scalajs_react_CtorType$Nullary(f), l, r)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.dimap__Ljapgolly_scalajs_react_CtorType$Nullary__F1__F1__Ljapgolly_scalajs_react_CtorType$Nullary = (function(x, f, g) {
  var jsx$1 = g.apply__O__O(x.unmodified$2);
  var g$1 = x.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$Nullary().init___O__F1__sjs_js_UndefOr(jsx$1, $f_F1__compose__F1__F1(g, g$1), x.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.rmap__O__F1__O = (function(f, m) {
  return this.rmap__Ljapgolly_scalajs_react_CtorType$Nullary__F1__Ljapgolly_scalajs_react_CtorType$Nullary($as_Ljapgolly_scalajs_react_CtorType$Nullary(f), m)
});
var $d_Ljapgolly_scalajs_react_CtorType$ProfunctorN$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$ProfunctorN$: 0
}, false, "japgolly.scalajs.react.CtorType$ProfunctorN$", {
  Ljapgolly_scalajs_react_CtorType$ProfunctorN$: 1,
  O: 1,
  Ljapgolly_scalajs_react_internal_Profunctor: 1
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$ProfunctorN$;
var $n_Ljapgolly_scalajs_react_CtorType$ProfunctorN$ = (void 0);
function $m_Ljapgolly_scalajs_react_CtorType$ProfunctorN$() {
  if ((!$n_Ljapgolly_scalajs_react_CtorType$ProfunctorN$)) {
    $n_Ljapgolly_scalajs_react_CtorType$ProfunctorN$ = new $c_Ljapgolly_scalajs_react_CtorType$ProfunctorN$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CtorType$ProfunctorN$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$ProfunctorP$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype = $c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype;
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.dimap__Ljapgolly_scalajs_react_CtorType$Props__F1__F1__Ljapgolly_scalajs_react_CtorType$Props = (function(ct, f, g) {
  var fn = ct.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$Props().init___F2__sjs_js_UndefOr(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, f$1, g$1, fn$1) {
    return (function(p$2, m$2) {
      return g$1.apply__O__O(fn$1.apply__O__O__O(f$1.apply__O__O(p$2), m$2))
    })
  })(this, f, g, fn)), ct.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.rmap__Ljapgolly_scalajs_react_CtorType$Props__F1__Ljapgolly_scalajs_react_CtorType$Props = (function(ct, g) {
  var fn = ct.construct$2;
  return new $c_Ljapgolly_scalajs_react_CtorType$Props().init___F2__sjs_js_UndefOr(new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this, g$1, fn$1) {
    return (function(p$2, m$2) {
      return g$1.apply__O__O(fn$1.apply__O__O__O(p$2, m$2))
    })
  })(this, g, fn)), ct.mods$2)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.dimap__O__F1__F1__O = (function(f, l, r) {
  return this.dimap__Ljapgolly_scalajs_react_CtorType$Props__F1__F1__Ljapgolly_scalajs_react_CtorType$Props($as_Ljapgolly_scalajs_react_CtorType$Props(f), l, r)
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.rmap__O__F1__O = (function(f, m) {
  return this.rmap__Ljapgolly_scalajs_react_CtorType$Props__F1__Ljapgolly_scalajs_react_CtorType$Props($as_Ljapgolly_scalajs_react_CtorType$Props(f), m)
});
var $d_Ljapgolly_scalajs_react_CtorType$ProfunctorP$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$ProfunctorP$: 0
}, false, "japgolly.scalajs.react.CtorType$ProfunctorP$", {
  Ljapgolly_scalajs_react_CtorType$ProfunctorP$: 1,
  O: 1,
  Ljapgolly_scalajs_react_internal_Profunctor: 1
});
$c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$ProfunctorP$;
var $n_Ljapgolly_scalajs_react_CtorType$ProfunctorP$ = (void 0);
function $m_Ljapgolly_scalajs_react_CtorType$ProfunctorP$() {
  if ((!$n_Ljapgolly_scalajs_react_CtorType$ProfunctorP$)) {
    $n_Ljapgolly_scalajs_react_CtorType$ProfunctorP$ = new $c_Ljapgolly_scalajs_react_CtorType$ProfunctorP$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CtorType$ProfunctorP$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Props() {
  $c_Ljapgolly_scalajs_react_CtorType.call(this);
  this.construct$2 = null;
  this.mods$2 = null
}
$c_Ljapgolly_scalajs_react_CtorType$Props.prototype = new $h_Ljapgolly_scalajs_react_CtorType();
$c_Ljapgolly_scalajs_react_CtorType$Props.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Props;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Props() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Props.prototype = $c_Ljapgolly_scalajs_react_CtorType$Props.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Props.prototype.init___F2__sjs_js_UndefOr = (function(construct, mods) {
  this.construct$2 = construct;
  this.mods$2 = mods;
  return this
});
function $is_Ljapgolly_scalajs_react_CtorType$Props(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CtorType$Props)))
}
function $as_Ljapgolly_scalajs_react_CtorType$Props(obj) {
  return (($is_Ljapgolly_scalajs_react_CtorType$Props(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CtorType$Props"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CtorType$Props(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CtorType$Props)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CtorType$Props(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CtorType$Props(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CtorType$Props;", depth))
}
var $d_Ljapgolly_scalajs_react_CtorType$Props = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Props: 0
}, false, "japgolly.scalajs.react.CtorType$Props", {
  Ljapgolly_scalajs_react_CtorType$Props: 1,
  Ljapgolly_scalajs_react_CtorType: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Props.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Props;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren() {
  $c_Ljapgolly_scalajs_react_CtorType.call(this);
  this.construct$2 = null;
  this.mods$2 = null
}
$c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype = new $h_Ljapgolly_scalajs_react_CtorType();
$c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$PropsAndChildren() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype = $c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype;
$c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype.init___F3__sjs_js_UndefOr = (function(construct, mods) {
  this.construct$2 = construct;
  this.mods$2 = mods;
  return this
});
function $is_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CtorType$PropsAndChildren)))
}
function $as_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj) {
  return (($is_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CtorType$PropsAndChildren"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CtorType$PropsAndChildren)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CtorType$PropsAndChildren(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CtorType$PropsAndChildren;", depth))
}
var $d_Ljapgolly_scalajs_react_CtorType$PropsAndChildren = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$PropsAndChildren: 0
}, false, "japgolly.scalajs.react.CtorType$PropsAndChildren", {
  Ljapgolly_scalajs_react_CtorType$PropsAndChildren: 1,
  Ljapgolly_scalajs_react_CtorType: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_CtorType$PropsAndChildren.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$PropsAndChildren;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1() {
  $c_O.call(this);
  this.summon$1 = null;
  this.pf$1 = null
}
$c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype = $c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype.init___F1__Ljapgolly_scalajs_react_internal_Profunctor = (function(f$6, p$3) {
  this.summon$1 = f$6;
  this.pf$1 = p$3;
  return this
});
var $d_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1: 0
}, false, "japgolly.scalajs.react.CtorType$Summoner$$anon$1", {
  Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1: 1,
  O: 1,
  Ljapgolly_scalajs_react_CtorType$Summoner: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Summoner$$anon$1;
function $is_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.Generic$UnmountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.Generic$UnmountedWithRoot;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Js$() {
  $c_O.call(this);
  this.rawComponentDisplayName$1 = null
}
$c_Ljapgolly_scalajs_react_component_Js$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Js$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Js$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Js$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Js$.prototype = $c_Ljapgolly_scalajs_react_component_Js$.prototype;
$c_Ljapgolly_scalajs_react_component_Js$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_component_Js$ = this;
  this.rawComponentDisplayName$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(a$2) {
      return $m_Ljapgolly_scalajs_react_component_Js$().japgolly$scalajs$react$component$Js$$readDisplayName__Ljapgolly_scalajs_react_raw_package$HasDisplayName__T(a$2)
    })
  })(this));
  return this
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.japgolly$scalajs$react$component$Js$$readDisplayName__Ljapgolly_scalajs_react_raw_package$HasDisplayName__T = (function(a) {
  var value = a.displayName;
  return $as_T(((value === (void 0)) ? "" : value))
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.component__sjs_js_Function1__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(rc, s) {
  var c = $as_Ljapgolly_scalajs_react_CtorType(s.pf$1.rmap__O__F1__O(s.summon$1.apply__O__O(rc), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(r$2) {
      return $m_Ljapgolly_scalajs_react_component_Js$().unmounted__Ljapgolly_scalajs_react_raw_React$ComponentElement__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(r$2)
    })
  })(this))));
  var pf = s.pf$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__sjs_js_Any__Ljapgolly_scalajs_react_CtorType__Ljapgolly_scalajs_react_internal_Profunctor(this, rc, c, pf)
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(raw, s, where, line) {
  var this$1 = $m_Ljapgolly_scalajs_react_component_InspectRaw$();
  var f = (function(this$2) {
    return (function() {
      return "JsComponent"
    })
  })(this);
  if ((!this$1.isComponent__sjs_js_Any__Z(raw))) {
    if ($is_T(raw)) {
      var this$4 = new $c_sci_StringOps().init___T("\n            |String arguments are no longer supported. Either:\n            |  * create a JS facade using @JSImport / @JSGlobal\n            |  * grab the JS value using js.Dynamic\n            |\n            |See https://github.com/japgolly/scalajs-react/blob/master/doc/INTEROP.md\"\n          ");
      var solution = $f_sci_StringLike__stripMargin__C__T(this$4, 124)
    } else {
      var this$6 = new $c_sci_StringOps().init___T("\n            |Make sure that\n            |  * your @JSImport / @JSGlobal annotations have the correct values\n            |  * the JS that you're referencing has been loaded into the JS environment\n          ");
      var solution = $f_sci_StringLike__stripMargin__C__T(this$6, 124)
    };
    var x = (((((((((((("\n           |\n           |!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n           |Invalid " + f()) + "! You've called ") + f()) + "(") + this$1.invalidComponentDesc$1__p1__sjs_js_Any__T(raw)) + ")\n           |Source: ") + where.value$2) + " (line #") + line.value$2) + ")\n           |\n           |") + $as_T(solution.trim())) + "\n           |!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n           |\n         ");
    var this$9 = new $c_sci_StringOps().init___T(x);
    var errMsg = $f_sci_StringLike__stripMargin__C__T(this$9, 124);
    try {
      new $c_s_util_Success().init___O(($m_Lorg_scalajs_dom_package$().console__Lorg_scalajs_dom_raw_Console().error(errMsg), (void 0)))
    } catch (e) {
      var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
      if ((e$2 !== null)) {
        matchEnd8: {
          var o11 = $m_s_util_control_NonFatal$().unapply__jl_Throwable__s_Option(e$2);
          if ((!o11.isEmpty__Z())) {
            var e$3 = $as_jl_Throwable(o11.get__O());
            new $c_s_util_Failure().init___jl_Throwable(e$3);
            break matchEnd8
          };
          throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
        }
      } else {
        throw e
      }
    };
    throw new $c_jl_AssertionError().init___O(errMsg)
  };
  return this.force__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(raw, s)
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.force__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(raw, s) {
  return this.component__sjs_js_Function1__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(raw, s)
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.unmounted__Ljapgolly_scalajs_react_raw_React$ComponentElement__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(r) {
  var m = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(r$2$2) {
      $m_Ljapgolly_scalajs_react_component_Js$();
      return new $c_Ljapgolly_scalajs_react_component_Js$$anon$1().init___Ljapgolly_scalajs_react_raw_React$Component(r$2$2)
    })
  })(this));
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$3().init___Ljapgolly_scalajs_react_raw_React$ComponentElement__F1(r, m)
});
var $d_Ljapgolly_scalajs_react_component_Js$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Js$: 0
}, false, "japgolly.scalajs.react.component.Js$", {
  Ljapgolly_scalajs_react_component_Js$: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate: 1
});
$c_Ljapgolly_scalajs_react_component_Js$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Js$;
var $n_Ljapgolly_scalajs_react_component_Js$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_Js$() {
  if ((!$n_Ljapgolly_scalajs_react_component_Js$)) {
    $n_Ljapgolly_scalajs_react_component_Js$ = new $c_Ljapgolly_scalajs_react_component_Js$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_Js$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_JsFn$() {
  $c_O.call(this);
  this.japgolly$scalajs$react$component$JsFn$$constUnit$1 = null
}
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_JsFn$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_JsFn$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_JsFn$.prototype = $c_Ljapgolly_scalajs_react_component_JsFn$.prototype;
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_component_JsFn$ = this;
  this.japgolly$scalajs$react$component$JsFn$$constUnit$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$6$2) {
      return (void 0)
    })
  })(this));
  return this
});
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype.apply__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Lsourcecode_FullName__Lsourcecode_Line__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(raw, s, where, line) {
  var this$1 = $m_Ljapgolly_scalajs_react_component_InspectRaw$();
  var f = (function(this$2) {
    return (function() {
      return "JsFnComponent"
    })
  })(this);
  if ((!this$1.isComponent__sjs_js_Any__Z(raw))) {
    if ($is_T(raw)) {
      var this$4 = new $c_sci_StringOps().init___T("\n            |String arguments are no longer supported. Either:\n            |  * create a JS facade using @JSImport / @JSGlobal\n            |  * grab the JS value using js.Dynamic\n            |\n            |See https://github.com/japgolly/scalajs-react/blob/master/doc/INTEROP.md\"\n          ");
      var solution = $f_sci_StringLike__stripMargin__C__T(this$4, 124)
    } else {
      var this$6 = new $c_sci_StringOps().init___T("\n            |Make sure that\n            |  * your @JSImport / @JSGlobal annotations have the correct values\n            |  * the JS that you're referencing has been loaded into the JS environment\n          ");
      var solution = $f_sci_StringLike__stripMargin__C__T(this$6, 124)
    };
    var x = (((((((((((("\n           |\n           |!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n           |Invalid " + f()) + "! You've called ") + f()) + "(") + this$1.invalidComponentDesc$1__p1__sjs_js_Any__T(raw)) + ")\n           |Source: ") + where.value$2) + " (line #") + line.value$2) + ")\n           |\n           |") + $as_T(solution.trim())) + "\n           |!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n           |\n         ");
    var this$9 = new $c_sci_StringOps().init___T(x);
    var errMsg = $f_sci_StringLike__stripMargin__C__T(this$9, 124);
    try {
      new $c_s_util_Success().init___O(($m_Lorg_scalajs_dom_package$().console__Lorg_scalajs_dom_raw_Console().error(errMsg), (void 0)))
    } catch (e) {
      var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
      if ((e$2 !== null)) {
        matchEnd8: {
          var o11 = $m_s_util_control_NonFatal$().unapply__jl_Throwable__s_Option(e$2);
          if ((!o11.isEmpty__Z())) {
            var e$3 = $as_jl_Throwable(o11.get__O());
            new $c_s_util_Failure().init___jl_Throwable(e$3);
            break matchEnd8
          };
          throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
        }
      } else {
        throw e
      }
    };
    throw new $c_jl_AssertionError().init___O(errMsg)
  };
  return this.force__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot(raw, s)
});
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype.force__sjs_js_Any__Ljapgolly_scalajs_react_CtorType$Summoner__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(raw, s) {
  var c = $as_Ljapgolly_scalajs_react_CtorType(s.pf$1.rmap__O__F1__O(s.summon$1.apply__O__O(raw), new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(r$2) {
      $m_Ljapgolly_scalajs_react_component_JsFn$();
      return new $c_Ljapgolly_scalajs_react_component_JsFn$$anon$1().init___Ljapgolly_scalajs_react_raw_React$ComponentElement(r$2)
    })
  })(this))));
  var pf = s.pf$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__sjs_js_Any__Ljapgolly_scalajs_react_CtorType__Ljapgolly_scalajs_react_internal_Profunctor(this, raw, c, pf)
});
var $d_Ljapgolly_scalajs_react_component_JsFn$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_JsFn$: 0
}, false, "japgolly.scalajs.react.component.JsFn$", {
  Ljapgolly_scalajs_react_component_JsFn$: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate: 1
});
$c_Ljapgolly_scalajs_react_component_JsFn$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_JsFn$;
var $n_Ljapgolly_scalajs_react_component_JsFn$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_JsFn$() {
  if ((!$n_Ljapgolly_scalajs_react_component_JsFn$)) {
    $n_Ljapgolly_scalajs_react_component_JsFn$ = new $c_Ljapgolly_scalajs_react_component_JsFn$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_JsFn$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount() {
  $c_O.call(this);
  this.raw$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$().equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z(this.raw$1, x$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount$().toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T(this.raw$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.init___Ljapgolly_scalajs_react_raw_React$Component = (function(raw) {
  this.raw$1 = raw;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.hashCode__I = (function() {
  var $$this = this.raw$1;
  return $objectHashCode($$this)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
function $is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount)))
}
function $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj) {
  return (($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillUnmount"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.builder.Lifecycle$ComponentWillUnmount;", depth))
}
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillUnmount", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUnmount;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate() {
  $c_O.call(this);
  this.raw$1 = null;
  this.nextProps$1 = null;
  this.nextState$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((((((("ComponentWillUpdate(props: " + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).props__O()) + " \u2192 ") + this.nextProps$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).state__O()) + " \u2192 ") + this.nextState$1) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype.init___Ljapgolly_scalajs_react_raw_React$Component__O__O = (function(raw, nextProps, nextState) {
  this.raw$1 = raw;
  this.nextProps$1 = nextProps;
  this.nextState$1 = nextState;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillUpdate", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate() {
  $c_O.call(this);
  this.raw$1 = null;
  this.nextProps$1 = null;
  this.nextState$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((((((("ShouldComponentUpdate(props: " + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).props__O()) + " \u2192 ") + this.nextProps$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).state__O()) + " \u2192 ") + this.nextState$1) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype.init___Ljapgolly_scalajs_react_raw_React$Component__O__O = (function(raw, nextProps, nextState) {
  this.raw$1 = raw;
  this.nextProps$1 = nextProps;
  this.nextState$1 = nextState;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ShouldComponentUpdate", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ShouldComponentUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$$anon$1() {
  $c_Ljapgolly_scalajs_react_internal_Effect.call(this)
}
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype = new $h_Ljapgolly_scalajs_react_internal_Effect();
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype.extract__F0__F0 = (function(a) {
  return a
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype.point__F0__O = (function(a) {
  return a.apply__O()
});
var $d_Ljapgolly_scalajs_react_internal_Effect$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$$anon$1: 0
}, false, "japgolly.scalajs.react.internal.Effect$$anon$1", {
  Ljapgolly_scalajs_react_internal_Effect$$anon$1: 1,
  Ljapgolly_scalajs_react_internal_Effect: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$$anon$2() {
  $c_Ljapgolly_scalajs_react_internal_Effect.call(this)
}
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype = new $h_Ljapgolly_scalajs_react_internal_Effect();
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$$anon$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$$anon$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype.extract__F0__F0 = (function(a) {
  var $$this = $as_Ljapgolly_scalajs_react_CallbackTo(a.apply__O()).japgolly$scalajs$react$CallbackTo$$f$1;
  return $$this
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype.point__F0__O = (function(a) {
  return new $c_Ljapgolly_scalajs_react_CallbackTo().init___F0(a)
});
var $d_Ljapgolly_scalajs_react_internal_Effect$$anon$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$$anon$2: 0
}, false, "japgolly.scalajs.react.internal.Effect$$anon$2", {
  Ljapgolly_scalajs_react_internal_Effect$$anon$2: 1,
  Ljapgolly_scalajs_react_internal_Effect: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$$anon$2.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$$anon$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id() {
  $c_Ljapgolly_scalajs_react_internal_Effect$Trans.call(this)
}
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype = new $h_Ljapgolly_scalajs_react_internal_Effect$Trans();
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype.constructor = $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id;
/** @constructor */
function $h_Ljapgolly_scalajs_react_internal_Effect$Trans$Id() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype = $c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype;
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype.apply__F0__O = (function(f) {
  return f.apply__O()
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype.init___Ljapgolly_scalajs_react_internal_Effect = (function(F) {
  $c_Ljapgolly_scalajs_react_internal_Effect$Trans.prototype.init___Ljapgolly_scalajs_react_internal_Effect__Ljapgolly_scalajs_react_internal_Effect.call(this, F, F);
  return this
});
var $d_Ljapgolly_scalajs_react_internal_Effect$Trans$Id = new $TypeData().initClass({
  Ljapgolly_scalajs_react_internal_Effect$Trans$Id: 0
}, false, "japgolly.scalajs.react.internal.Effect$Trans$Id", {
  Ljapgolly_scalajs_react_internal_Effect$Trans$Id: 1,
  Ljapgolly_scalajs_react_internal_Effect$Trans: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_internal_Effect$Trans$Id.prototype.$classData = $d_Ljapgolly_scalajs_react_internal_Effect$Trans$Id;
/** @constructor */
function $c_Ljapgolly_scalajs_react_package$() {
  $c_O.call(this);
  this.GenericComponent$1 = null;
  this.JsComponent$1 = null;
  this.JsFnComponent$1 = null;
  this.ScalaComponent$1 = null;
  this.ScalaFnComponent$1 = null
}
$c_Ljapgolly_scalajs_react_package$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_package$.prototype.constructor = $c_Ljapgolly_scalajs_react_package$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_package$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_package$.prototype = $c_Ljapgolly_scalajs_react_package$.prototype;
$c_Ljapgolly_scalajs_react_package$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_package$ = this;
  this.GenericComponent$1 = $m_Ljapgolly_scalajs_react_component_Generic$();
  this.JsComponent$1 = $m_Ljapgolly_scalajs_react_component_Js$();
  this.JsFnComponent$1 = $m_Ljapgolly_scalajs_react_component_JsFn$();
  this.ScalaComponent$1 = $m_Ljapgolly_scalajs_react_component_Scala$();
  this.ScalaFnComponent$1 = $m_Ljapgolly_scalajs_react_component_ScalaFn$();
  return this
});
var $d_Ljapgolly_scalajs_react_package$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_package$: 0
}, false, "japgolly.scalajs.react.package$", {
  Ljapgolly_scalajs_react_package$: 1,
  O: 1,
  Ljapgolly_scalajs_react_ReactEventTypes: 1
});
$c_Ljapgolly_scalajs_react_package$.prototype.$classData = $d_Ljapgolly_scalajs_react_package$;
var $n_Ljapgolly_scalajs_react_package$ = (void 0);
function $m_Ljapgolly_scalajs_react_package$() {
  if ((!$n_Ljapgolly_scalajs_react_package$)) {
    $n_Ljapgolly_scalajs_react_package$ = new $c_Ljapgolly_scalajs_react_package$().init___()
  };
  return $n_Ljapgolly_scalajs_react_package$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr$Generic() {
  $c_Ljapgolly_scalajs_react_vdom_Attr.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype = new $h_Ljapgolly_scalajs_react_vdom_Attr();
$c_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr$Generic;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr$Generic() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype.init___T = (function(name) {
  $c_Ljapgolly_scalajs_react_vdom_Attr.prototype.init___T.call(this, name);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Attr$Generic = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Attr$Generic: 0
}, false, "japgolly.scalajs.react.vdom.Attr$Generic", {
  Ljapgolly_scalajs_react_vdom_Attr$Generic: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Attr$Generic.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Attr$Generic;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr$Key$() {
  $c_Ljapgolly_scalajs_react_vdom_Attr.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype = new $h_Ljapgolly_scalajs_react_vdom_Attr();
$c_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr$Key$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr$Key$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype.init___ = (function() {
  $c_Ljapgolly_scalajs_react_vdom_Attr.prototype.init___T.call(this, "key");
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Attr$Key$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Attr$Key$: 0
}, false, "japgolly.scalajs.react.vdom.Attr$Key$", {
  Ljapgolly_scalajs_react_vdom_Attr$Key$: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Attr$Key$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Attr$Key$;
var $n_Ljapgolly_scalajs_react_vdom_Attr$Key$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Attr$Key$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Attr$Key$)) {
    $n_Ljapgolly_scalajs_react_vdom_Attr$Key$ = new $c_Ljapgolly_scalajs_react_vdom_Attr$Key$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Attr$Key$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_HtmlTags$() {
  $c_O.call(this);
  this.a$module$1 = null;
  this.input$module$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_HtmlTags$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_HtmlTags$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype = $c_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype;
$c_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_HtmlTags$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_HtmlTags$: 0
}, false, "japgolly.scalajs.react.vdom.HtmlTags$", {
  Ljapgolly_scalajs_react_vdom_HtmlTags$: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_HtmlTags: 1
});
$c_Ljapgolly_scalajs_react_vdom_HtmlTags$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_HtmlTags$;
var $n_Ljapgolly_scalajs_react_vdom_HtmlTags$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_HtmlTags$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_HtmlTags$)) {
    $n_Ljapgolly_scalajs_react_vdom_HtmlTags$ = new $c_Ljapgolly_scalajs_react_vdom_HtmlTags$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_HtmlTags$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Style() {
  $c_Ljapgolly_scalajs_react_vdom_Attr.call(this);
  this.name$2 = null
}
$c_Ljapgolly_scalajs_react_vdom_Style.prototype = new $h_Ljapgolly_scalajs_react_vdom_Attr();
$c_Ljapgolly_scalajs_react_vdom_Style.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Style;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Style() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Style.prototype = $c_Ljapgolly_scalajs_react_vdom_Style.prototype;
$c_Ljapgolly_scalajs_react_vdom_Style.prototype.$$colon$eq__O__F2__Ljapgolly_scalajs_react_vdom_TagMod = (function(a, t) {
  $m_Ljapgolly_scalajs_react_vdom_TagMod$();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, a$1, t$1) {
    return (function(b$2) {
      var b = $as_Ljapgolly_scalajs_react_vdom_Builder(b$2);
      t$1.apply__O__O__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this$1, b$1) {
        return (function(x$1$2) {
          b$1.addStyle$1.apply__O__O__O($this$1.name$2, x$1$2)
        })
      })($this, b)), a$1)
    })
  })(this, a, t));
  return new $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2().init___F1(f)
});
$c_Ljapgolly_scalajs_react_vdom_Style.prototype.init___T = (function(name) {
  this.name$2 = name;
  $c_Ljapgolly_scalajs_react_vdom_Attr.prototype.init___T.call(this, ("style." + name));
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Style = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Style: 0
}, false, "japgolly.scalajs.react.vdom.Style", {
  Ljapgolly_scalajs_react_vdom_Style: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Style.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Style;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2() {
  $c_O.call(this);
  this.f$1$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype = $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype;
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype.init___F1 = (function(f$1) {
  this.f$1$1 = f$1;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  this.f$1$1.apply__O__O(b)
});
var $d_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_TagMod$$anon$2: 0
}, false, "japgolly.scalajs.react.vdom.TagMod$$anon$2", {
  Ljapgolly_scalajs_react_vdom_TagMod$$anon$2: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_TagMod$$anon$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype = $c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype;
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  /*<skip>*/
});
var $d_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_TagMod$$anon$3: 0
}, false, "japgolly.scalajs.react.vdom.TagMod$$anon$3", {
  Ljapgolly_scalajs_react_vdom_TagMod$$anon$3: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_TagMod$$anon$3;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_TagOf() {
  $c_O.call(this);
  this.render$1 = null;
  this.tag$1 = null;
  this.modifiers$1 = null;
  this.namespace$1 = null;
  this.bitmap$0$1 = false
}
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_TagOf;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_TagOf() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_TagOf.prototype = $c_Ljapgolly_scalajs_react_vdom_TagOf.prototype;
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.init___T__sci_List__T = (function(tag, modifiers, namespace) {
  this.tag$1 = tag;
  this.modifiers$1 = modifiers;
  this.namespace$1 = namespace;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.toString__T = (function() {
  return this.render__Ljapgolly_scalajs_react_vdom_VdomElement().toString__T()
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.render$lzycompute__p1__Ljapgolly_scalajs_react_vdom_VdomElement = (function() {
  if ((!this.bitmap$0$1)) {
    var b = new $c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement().init___();
    this.build__p1__Ljapgolly_scalajs_react_vdom_Builder__V(b);
    this.render$1 = b.render__T__Ljapgolly_scalajs_react_vdom_VdomElement(this.tag$1);
    this.bitmap$0$1 = true
  };
  return this.render$1
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.build__p1__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  var current = this.modifiers$1;
  var this$1 = this.modifiers$1;
  var arr = $newArrayObject($d_sc_Seq.getArrayOf(), [$f_sc_LinearSeqOptimized__length__I(this$1)]);
  var i = 0;
  while (true) {
    var x = current;
    var x$2 = $m_sci_Nil$();
    if ((!((x !== null) && x.equals__O__Z(x$2)))) {
      arr.set(i, $as_sc_Seq(current.head__O()));
      var this$2 = current;
      current = this$2.tail__sci_List();
      i = ((1 + i) | 0)
    } else {
      break
    }
  };
  var j = arr.u.length;
  while ((j > 0)) {
    j = (((-1) + j) | 0);
    var frag = arr.get(j);
    var i$2 = 0;
    while ((i$2 < frag.length__I())) {
      $as_Ljapgolly_scalajs_react_vdom_TagMod(frag.apply__I__O(i$2)).applyTo__Ljapgolly_scalajs_react_vdom_Builder__V(b);
      i$2 = ((1 + i$2) | 0)
    }
  }
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  var jsx$1 = b.appendChild$1;
  var a = this.render__Ljapgolly_scalajs_react_vdom_VdomElement().rawElement$2;
  jsx$1.apply__O__O(a)
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.render__Ljapgolly_scalajs_react_vdom_VdomElement = (function() {
  return ((!this.bitmap$0$1) ? this.render$lzycompute__p1__Ljapgolly_scalajs_react_vdom_VdomElement() : this.render$1)
});
var $d_Ljapgolly_scalajs_react_vdom_TagOf = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_TagOf: 0
}, false, "japgolly.scalajs.react.vdom.TagOf", {
  Ljapgolly_scalajs_react_vdom_TagOf: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_TagOf.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_TagOf;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomNode() {
  $c_O.call(this);
  this.rawNode$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomNode;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomNode() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomNode.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  b.appendChild$1.apply__O__O(this.rawNode$1)
});
$c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.init___sjs_js_$bar = (function(rawNode) {
  this.rawNode$1 = rawNode;
  return this
});
function $is_Ljapgolly_scalajs_react_vdom_VdomNode(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_VdomNode)))
}
function $as_Ljapgolly_scalajs_react_vdom_VdomNode(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_VdomNode(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.VdomNode"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_VdomNode(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_VdomNode)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_VdomNode(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_VdomNode(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.VdomNode;", depth))
}
var $d_Ljapgolly_scalajs_react_vdom_VdomNode = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomNode: 0
}, false, "japgolly.scalajs.react.vdom.VdomNode", {
  Ljapgolly_scalajs_react_vdom_VdomNode: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomNode;
/** @constructor */
function $c_jl_Number() {
  $c_O.call(this)
}
$c_jl_Number.prototype = new $h_O();
$c_jl_Number.prototype.constructor = $c_jl_Number;
/** @constructor */
function $h_jl_Number() {
  /*<skip>*/
}
$h_jl_Number.prototype = $c_jl_Number.prototype;
function $is_jl_Number(obj) {
  return (!(!(((obj && obj.$classData) && obj.$classData.ancestors.jl_Number) || ((typeof obj) === "number"))))
}
function $as_jl_Number(obj) {
  return (($is_jl_Number(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Number"))
}
function $isArrayOf_jl_Number(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Number)))
}
function $asArrayOf_jl_Number(obj, depth) {
  return (($isArrayOf_jl_Number(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Number;", depth))
}
/** @constructor */
function $c_jl_Throwable() {
  $c_O.call(this);
  this.s$1 = null;
  this.e$1 = null;
  this.stackTrace$1 = null
}
$c_jl_Throwable.prototype = new $h_O();
$c_jl_Throwable.prototype.constructor = $c_jl_Throwable;
/** @constructor */
function $h_jl_Throwable() {
  /*<skip>*/
}
$h_jl_Throwable.prototype = $c_jl_Throwable.prototype;
$c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable = (function() {
  var v = $g.Error.captureStackTrace;
  if ((v === (void 0))) {
    try {
      var e$1 = {}.undef()
    } catch (e) {
      var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
      if ((e$2 !== null)) {
        if ($is_sjs_js_JavaScriptException(e$2)) {
          var x5 = $as_sjs_js_JavaScriptException(e$2);
          var e$3 = x5.exception$4;
          var e$1 = e$3
        } else {
          var e$1;
          throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
        }
      } else {
        var e$1;
        throw e
      }
    };
    this.stackdata = e$1
  } else {
    $g.Error.captureStackTrace(this);
    this.stackdata = this
  };
  return this
});
$c_jl_Throwable.prototype.getMessage__T = (function() {
  return this.s$1
});
$c_jl_Throwable.prototype.toString__T = (function() {
  var className = $objectGetClass(this).getName__T();
  var message = this.getMessage__T();
  return ((message === null) ? className : ((className + ": ") + message))
});
$c_jl_Throwable.prototype.init___T__jl_Throwable = (function(s, e) {
  this.s$1 = s;
  this.e$1 = e;
  this.fillInStackTrace__jl_Throwable();
  return this
});
function $is_jl_Throwable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Throwable)))
}
function $as_jl_Throwable(obj) {
  return (($is_jl_Throwable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Throwable"))
}
function $isArrayOf_jl_Throwable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Throwable)))
}
function $asArrayOf_jl_Throwable(obj, depth) {
  return (($isArrayOf_jl_Throwable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Throwable;", depth))
}
/** @constructor */
function $c_ju_regex_Matcher() {
  $c_O.call(this);
  this.pattern0$1 = null;
  this.input0$1 = null;
  this.regionStart0$1 = 0;
  this.regionEnd0$1 = 0;
  this.regexp$1 = null;
  this.inputstr$1 = null;
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = false;
  this.appendPos$1 = 0;
  this.startOfGroupCache$1 = null
}
$c_ju_regex_Matcher.prototype = new $h_O();
$c_ju_regex_Matcher.prototype.constructor = $c_ju_regex_Matcher;
/** @constructor */
function $h_ju_regex_Matcher() {
  /*<skip>*/
}
$h_ju_regex_Matcher.prototype = $c_ju_regex_Matcher.prototype;
$c_ju_regex_Matcher.prototype.find__Z = (function() {
  if (this.canStillFind$1) {
    this.lastMatchIsValid$1 = true;
    this.lastMatch$1 = this.regexp$1.exec(this.inputstr$1);
    if ((this.lastMatch$1 !== null)) {
      var value = this.lastMatch$1[0];
      if ((value === (void 0))) {
        throw new $c_ju_NoSuchElementException().init___T("undefined.get")
      };
      var thiz = $as_T(value);
      if ((thiz === null)) {
        throw new $c_jl_NullPointerException().init___()
      };
      if ((thiz === "")) {
        var ev$1 = this.regexp$1;
        ev$1.lastIndex = ((1 + $uI(ev$1.lastIndex)) | 0)
      }
    } else {
      this.canStillFind$1 = false
    };
    this.startOfGroupCache$1 = $m_s_None$();
    return (this.lastMatch$1 !== null)
  } else {
    return false
  }
});
$c_ju_regex_Matcher.prototype.ensureLastMatch__p1__sjs_js_RegExp$ExecResult = (function() {
  if ((this.lastMatch$1 === null)) {
    throw new $c_jl_IllegalStateException().init___T("No match available")
  };
  return this.lastMatch$1
});
$c_ju_regex_Matcher.prototype.group__I__T = (function(group) {
  var value = this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult()[group];
  return $as_T(((value === (void 0)) ? null : value))
});
$c_ju_regex_Matcher.prototype.appendTail__jl_StringBuffer__jl_StringBuffer = (function(sb) {
  var thiz = this.inputstr$1;
  var beginIndex = this.appendPos$1;
  sb.append__T__jl_StringBuffer($as_T(thiz.substring(beginIndex)));
  var thiz$1 = this.inputstr$1;
  this.appendPos$1 = $uI(thiz$1.length);
  return sb
});
$c_ju_regex_Matcher.prototype.end__I = (function() {
  var jsx$1 = this.start__I();
  var thiz = this.group__T();
  return ((jsx$1 + $uI(thiz.length)) | 0)
});
$c_ju_regex_Matcher.prototype.init___ju_regex_Pattern__jl_CharSequence__I__I = (function(pattern0, input0, regionStart0, regionEnd0) {
  this.pattern0$1 = pattern0;
  this.input0$1 = input0;
  this.regionStart0$1 = regionStart0;
  this.regionEnd0$1 = regionEnd0;
  this.regexp$1 = this.pattern0$1.newJSRegExp__sjs_js_RegExp();
  this.inputstr$1 = $objectToString($charSequenceSubSequence(this.input0$1, this.regionStart0$1, this.regionEnd0$1));
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = true;
  this.appendPos$1 = 0;
  this.startOfGroupCache$1 = $m_s_None$();
  return this
});
$c_ju_regex_Matcher.prototype.appendReplacement__jl_StringBuffer__T__ju_regex_Matcher = (function(sb, replacement) {
  var thiz = this.inputstr$1;
  var beginIndex = this.appendPos$1;
  var endIndex = this.start__I();
  sb.append__T__jl_StringBuffer($as_T(thiz.substring(beginIndex, endIndex)));
  var len = $uI(replacement.length);
  var i = 0;
  while ((i < len)) {
    var index = i;
    var x1 = (65535 & $uI(replacement.charCodeAt(index)));
    switch (x1) {
      case 36: {
        i = ((1 + i) | 0);
        var j = i;
        while (true) {
          if ((i < len)) {
            var index$1 = i;
            var c = (65535 & $uI(replacement.charCodeAt(index$1)));
            var jsx$1 = ((c >= 48) && (c <= 57))
          } else {
            var jsx$1 = false
          };
          if (jsx$1) {
            i = ((1 + i) | 0)
          } else {
            break
          }
        };
        var this$8 = $m_jl_Integer$();
        var endIndex$1 = i;
        var s = $as_T(replacement.substring(j, endIndex$1));
        var group = this$8.parseInt__T__I__I(s, 10);
        sb.append__T__jl_StringBuffer(this.group__I__T(group));
        break
      }
      case 92: {
        i = ((1 + i) | 0);
        if ((i < len)) {
          var index$2 = i;
          sb.append__C__jl_StringBuffer((65535 & $uI(replacement.charCodeAt(index$2))))
        };
        i = ((1 + i) | 0);
        break
      }
      default: {
        sb.append__C__jl_StringBuffer(x1);
        i = ((1 + i) | 0)
      }
    }
  };
  this.appendPos$1 = this.end__I();
  return this
});
$c_ju_regex_Matcher.prototype.replaceAll__T__T = (function(replacement) {
  this.reset__ju_regex_Matcher();
  var sb = new $c_jl_StringBuffer().init___();
  while (this.find__Z()) {
    this.appendReplacement__jl_StringBuffer__T__ju_regex_Matcher(sb, replacement)
  };
  this.appendTail__jl_StringBuffer__jl_StringBuffer(sb);
  return sb.toString__T()
});
$c_ju_regex_Matcher.prototype.group__T = (function() {
  var value = this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult()[0];
  if ((value === (void 0))) {
    throw new $c_ju_NoSuchElementException().init___T("undefined.get")
  };
  return $as_T(value)
});
$c_ju_regex_Matcher.prototype.start__I = (function() {
  return $uI(this.ensureLastMatch__p1__sjs_js_RegExp$ExecResult().index)
});
$c_ju_regex_Matcher.prototype.reset__ju_regex_Matcher = (function() {
  this.regexp$1.lastIndex = 0;
  this.lastMatch$1 = null;
  this.lastMatchIsValid$1 = false;
  this.canStillFind$1 = true;
  this.appendPos$1 = 0;
  this.startOfGroupCache$1 = $m_s_None$();
  return this
});
var $d_ju_regex_Matcher = new $TypeData().initClass({
  ju_regex_Matcher: 0
}, false, "java.util.regex.Matcher", {
  ju_regex_Matcher: 1,
  O: 1,
  ju_regex_MatchResult: 1
});
$c_ju_regex_Matcher.prototype.$classData = $d_ju_regex_Matcher;
function $f_s_Product2__productElement__I__O($thiz, n) {
  switch (n) {
    case 0: {
      return $thiz.$$und1$f;
      break
    }
    case 1: {
      return $thiz.$$und2$f;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $f_s_Product3__productElement__I__O($thiz, n) {
  switch (n) {
    case 0: {
      return $thiz.$$und1$1;
      break
    }
    case 1: {
      return $thiz.$$und2$1;
      break
    }
    case 2: {
      return $thiz.$$und3$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
/** @constructor */
function $c_s_package$$anon$1() {
  $c_O.call(this)
}
$c_s_package$$anon$1.prototype = new $h_O();
$c_s_package$$anon$1.prototype.constructor = $c_s_package$$anon$1;
/** @constructor */
function $h_s_package$$anon$1() {
  /*<skip>*/
}
$h_s_package$$anon$1.prototype = $c_s_package$$anon$1.prototype;
$c_s_package$$anon$1.prototype.init___ = (function() {
  return this
});
$c_s_package$$anon$1.prototype.toString__T = (function() {
  return "object AnyRef"
});
var $d_s_package$$anon$1 = new $TypeData().initClass({
  s_package$$anon$1: 0
}, false, "scala.package$$anon$1", {
  s_package$$anon$1: 1,
  O: 1,
  s_Specializable: 1
});
$c_s_package$$anon$1.prototype.$classData = $d_s_package$$anon$1;
/** @constructor */
function $c_s_util_hashing_MurmurHash3$() {
  $c_s_util_hashing_MurmurHash3.call(this);
  this.seqSeed$2 = 0;
  this.mapSeed$2 = 0;
  this.setSeed$2 = 0
}
$c_s_util_hashing_MurmurHash3$.prototype = new $h_s_util_hashing_MurmurHash3();
$c_s_util_hashing_MurmurHash3$.prototype.constructor = $c_s_util_hashing_MurmurHash3$;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3$.prototype = $c_s_util_hashing_MurmurHash3$.prototype;
$c_s_util_hashing_MurmurHash3$.prototype.init___ = (function() {
  $n_s_util_hashing_MurmurHash3$ = this;
  this.seqSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Seq");
  this.mapSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Map");
  this.setSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Set");
  return this
});
$c_s_util_hashing_MurmurHash3$.prototype.seqHash__sc_Seq__I = (function(xs) {
  if ($is_sci_List(xs)) {
    var x2 = $as_sci_List(xs);
    return this.listHash__sci_List__I__I(x2, this.seqSeed$2)
  } else {
    return this.orderedHash__sc_TraversableOnce__I__I(xs, this.seqSeed$2)
  }
});
var $d_s_util_hashing_MurmurHash3$ = new $TypeData().initClass({
  s_util_hashing_MurmurHash3$: 0
}, false, "scala.util.hashing.MurmurHash3$", {
  s_util_hashing_MurmurHash3$: 1,
  s_util_hashing_MurmurHash3: 1,
  O: 1
});
$c_s_util_hashing_MurmurHash3$.prototype.$classData = $d_s_util_hashing_MurmurHash3$;
var $n_s_util_hashing_MurmurHash3$ = (void 0);
function $m_s_util_hashing_MurmurHash3$() {
  if ((!$n_s_util_hashing_MurmurHash3$)) {
    $n_s_util_hashing_MurmurHash3$ = new $c_s_util_hashing_MurmurHash3$().init___()
  };
  return $n_s_util_hashing_MurmurHash3$
}
function $f_sc_Iterator__isEmpty__Z($thiz) {
  return (!$thiz.hasNext__Z())
}
function $f_sc_Iterator__toString__T($thiz) {
  return (($thiz.hasNext__Z() ? "non-empty" : "empty") + " iterator")
}
function $f_sc_Iterator__foreach__F1__V($thiz, f) {
  while ($thiz.hasNext__Z()) {
    f.apply__O__O($thiz.next__O())
  }
}
function $f_sc_Iterator__toStream__sci_Stream($thiz) {
  if ($thiz.hasNext__Z()) {
    var hd = $thiz.next__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
      return (function() {
        return $this.toStream__sci_Stream()
      })
    })($thiz));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  } else {
    $m_sci_Stream$();
    return $m_sci_Stream$Empty$()
  }
}
function $f_sc_Iterator__copyToArray__O__I__I__V($thiz, xs, start, len) {
  var i = start;
  var y = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = ((start + ((len < y) ? len : y)) | 0);
  while (((i < end) && $thiz.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, $thiz.next__O());
    i = ((1 + i) | 0)
  }
}
/** @constructor */
function $c_sc_TraversableLike$WithFilter() {
  $c_O.call(this);
  this.p$1 = null;
  this.$$outer$1 = null
}
$c_sc_TraversableLike$WithFilter.prototype = new $h_O();
$c_sc_TraversableLike$WithFilter.prototype.constructor = $c_sc_TraversableLike$WithFilter;
/** @constructor */
function $h_sc_TraversableLike$WithFilter() {
  /*<skip>*/
}
$h_sc_TraversableLike$WithFilter.prototype = $c_sc_TraversableLike$WithFilter.prototype;
$c_sc_TraversableLike$WithFilter.prototype.foreach__F1__V = (function(f) {
  this.$$outer$1.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1) {
    return (function(x$2) {
      return ($uZ($this.p$1.apply__O__O(x$2)) ? f$1.apply__O__O(x$2) : (void 0))
    })
  })(this, f)))
});
$c_sc_TraversableLike$WithFilter.prototype.init___sc_TraversableLike__F1 = (function($$outer, p) {
  this.p$1 = p;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
var $d_sc_TraversableLike$WithFilter = new $TypeData().initClass({
  sc_TraversableLike$WithFilter: 0
}, false, "scala.collection.TraversableLike$WithFilter", {
  sc_TraversableLike$WithFilter: 1,
  O: 1,
  scg_FilterMonadic: 1
});
$c_sc_TraversableLike$WithFilter.prototype.$classData = $d_sc_TraversableLike$WithFilter;
/** @constructor */
function $c_scg_GenTraversableFactory() {
  $c_scg_GenericCompanion.call(this);
  this.ReusableCBFInstance$2 = null
}
$c_scg_GenTraversableFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenTraversableFactory.prototype.constructor = $c_scg_GenTraversableFactory;
/** @constructor */
function $h_scg_GenTraversableFactory() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory.prototype = $c_scg_GenTraversableFactory.prototype;
$c_scg_GenTraversableFactory.prototype.init___ = (function() {
  this.ReusableCBFInstance$2 = new $c_scg_GenTraversableFactory$$anon$1().init___scg_GenTraversableFactory(this);
  return this
});
/** @constructor */
function $c_scg_GenTraversableFactory$GenericCanBuildFrom() {
  $c_O.call(this);
  this.$$outer$1 = null
}
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = new $h_O();
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.constructor = $c_scg_GenTraversableFactory$GenericCanBuildFrom;
/** @constructor */
function $h_scg_GenTraversableFactory$GenericCanBuildFrom() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype;
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__scm_Builder = (function() {
  return this.$$outer$1.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__O__scm_Builder = (function(from) {
  var from$1 = $as_sc_GenTraversable(from);
  return from$1.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
/** @constructor */
function $c_sci_List$$anon$1() {
  $c_O.call(this)
}
$c_sci_List$$anon$1.prototype = new $h_O();
$c_sci_List$$anon$1.prototype.constructor = $c_sci_List$$anon$1;
/** @constructor */
function $h_sci_List$$anon$1() {
  /*<skip>*/
}
$h_sci_List$$anon$1.prototype = $c_sci_List$$anon$1.prototype;
$c_sci_List$$anon$1.prototype.init___ = (function() {
  return this
});
$c_sci_List$$anon$1.prototype.apply__O__O = (function(x) {
  return this
});
$c_sci_List$$anon$1.prototype.toString__T = (function() {
  return "<function1>"
});
var $d_sci_List$$anon$1 = new $TypeData().initClass({
  sci_List$$anon$1: 0
}, false, "scala.collection.immutable.List$$anon$1", {
  sci_List$$anon$1: 1,
  O: 1,
  F1: 1
});
$c_sci_List$$anon$1.prototype.$classData = $d_sci_List$$anon$1;
/** @constructor */
function $c_sci_Stream$StreamWithFilter() {
  $c_O.call(this);
  this.filtered$1 = null;
  this.p$1 = null;
  this.s$1 = null;
  this.bitmap$0$1 = false
}
$c_sci_Stream$StreamWithFilter.prototype = new $h_O();
$c_sci_Stream$StreamWithFilter.prototype.constructor = $c_sci_Stream$StreamWithFilter;
/** @constructor */
function $h_sci_Stream$StreamWithFilter() {
  /*<skip>*/
}
$h_sci_Stream$StreamWithFilter.prototype = $c_sci_Stream$StreamWithFilter.prototype;
$c_sci_Stream$StreamWithFilter.prototype.foreach__F1__V = (function(f) {
  this.filtered__p1__sci_Stream().foreach__F1__V(f)
});
$c_sci_Stream$StreamWithFilter.prototype.filtered__p1__sci_Stream = (function() {
  return ((!this.bitmap$0$1) ? this.filtered$lzycompute__p1__sci_Stream() : this.filtered$1)
});
$c_sci_Stream$StreamWithFilter.prototype.init___F0__F1 = (function(sl, p) {
  this.p$1 = p;
  this.s$1 = $as_sci_Stream(sl.apply__O());
  return this
});
$c_sci_Stream$StreamWithFilter.prototype.filtered$lzycompute__p1__sci_Stream = (function() {
  if ((!this.bitmap$0$1)) {
    var this$1 = this.s$1;
    var p = this.p$1;
    var f = this$1.filterImpl__F1__Z__sci_Stream(p, false);
    this.s$1 = null;
    this.filtered$1 = f;
    this.bitmap$0$1 = true
  };
  return this.filtered$1
});
var $d_sci_Stream$StreamWithFilter = new $TypeData().initClass({
  sci_Stream$StreamWithFilter: 0
}, false, "scala.collection.immutable.Stream$StreamWithFilter", {
  sci_Stream$StreamWithFilter: 1,
  O: 1,
  scg_FilterMonadic: 1
});
$c_sci_Stream$StreamWithFilter.prototype.$classData = $d_sci_Stream$StreamWithFilter;
function $f_scm_Builder__sizeHint__sc_TraversableLike__V($thiz, coll) {
  var x1 = coll.sizeHintIfCheap__I();
  switch (x1) {
    case (-1): {
      break
    }
    default: {
      $thiz.sizeHint__I__V(x1)
    }
  }
}
function $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V($thiz, size, boundingColl) {
  var x1 = boundingColl.sizeHintIfCheap__I();
  switch (x1) {
    case (-1): {
      break
    }
    default: {
      $thiz.sizeHint__I__V(((size < x1) ? size : x1))
    }
  }
}
function $is_scm_Builder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Builder)))
}
function $as_scm_Builder(obj) {
  return (($is_scm_Builder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Builder"))
}
function $isArrayOf_scm_Builder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Builder)))
}
function $asArrayOf_scm_Builder(obj, depth) {
  return (($isArrayOf_scm_Builder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Builder;", depth))
}
/** @constructor */
function $c_sr_AbstractFunction0() {
  $c_O.call(this)
}
$c_sr_AbstractFunction0.prototype = new $h_O();
$c_sr_AbstractFunction0.prototype.constructor = $c_sr_AbstractFunction0;
/** @constructor */
function $h_sr_AbstractFunction0() {
  /*<skip>*/
}
$h_sr_AbstractFunction0.prototype = $c_sr_AbstractFunction0.prototype;
$c_sr_AbstractFunction0.prototype.toString__T = (function() {
  return "<function0>"
});
/** @constructor */
function $c_sr_AbstractFunction1() {
  $c_O.call(this)
}
$c_sr_AbstractFunction1.prototype = new $h_O();
$c_sr_AbstractFunction1.prototype.constructor = $c_sr_AbstractFunction1;
/** @constructor */
function $h_sr_AbstractFunction1() {
  /*<skip>*/
}
$h_sr_AbstractFunction1.prototype = $c_sr_AbstractFunction1.prototype;
$c_sr_AbstractFunction1.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_sr_AbstractFunction2() {
  $c_O.call(this)
}
$c_sr_AbstractFunction2.prototype = new $h_O();
$c_sr_AbstractFunction2.prototype.constructor = $c_sr_AbstractFunction2;
/** @constructor */
function $h_sr_AbstractFunction2() {
  /*<skip>*/
}
$h_sr_AbstractFunction2.prototype = $c_sr_AbstractFunction2.prototype;
$c_sr_AbstractFunction2.prototype.toString__T = (function() {
  return "<function2>"
});
/** @constructor */
function $c_sr_AbstractFunction3() {
  $c_O.call(this)
}
$c_sr_AbstractFunction3.prototype = new $h_O();
$c_sr_AbstractFunction3.prototype.constructor = $c_sr_AbstractFunction3;
/** @constructor */
function $h_sr_AbstractFunction3() {
  /*<skip>*/
}
$h_sr_AbstractFunction3.prototype = $c_sr_AbstractFunction3.prototype;
$c_sr_AbstractFunction3.prototype.toString__T = (function() {
  return "<function3>"
});
/** @constructor */
function $c_sr_AbstractFunction4() {
  $c_O.call(this)
}
$c_sr_AbstractFunction4.prototype = new $h_O();
$c_sr_AbstractFunction4.prototype.constructor = $c_sr_AbstractFunction4;
/** @constructor */
function $h_sr_AbstractFunction4() {
  /*<skip>*/
}
$h_sr_AbstractFunction4.prototype = $c_sr_AbstractFunction4.prototype;
$c_sr_AbstractFunction4.prototype.toString__T = (function() {
  return "<function4>"
});
/** @constructor */
function $c_sr_BooleanRef() {
  $c_O.call(this);
  this.elem$1 = false
}
$c_sr_BooleanRef.prototype = new $h_O();
$c_sr_BooleanRef.prototype.constructor = $c_sr_BooleanRef;
/** @constructor */
function $h_sr_BooleanRef() {
  /*<skip>*/
}
$h_sr_BooleanRef.prototype = $c_sr_BooleanRef.prototype;
$c_sr_BooleanRef.prototype.toString__T = (function() {
  var b = this.elem$1;
  return ("" + b)
});
$c_sr_BooleanRef.prototype.init___Z = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_BooleanRef = new $TypeData().initClass({
  sr_BooleanRef: 0
}, false, "scala.runtime.BooleanRef", {
  sr_BooleanRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_BooleanRef.prototype.$classData = $d_sr_BooleanRef;
function $isArrayOf_sr_BoxedUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_BoxedUnit)))
}
function $asArrayOf_sr_BoxedUnit(obj, depth) {
  return (($isArrayOf_sr_BoxedUnit(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.BoxedUnit;", depth))
}
var $d_sr_BoxedUnit = new $TypeData().initClass({
  sr_BoxedUnit: 0
}, false, "scala.runtime.BoxedUnit", {
  sr_BoxedUnit: 1,
  O: 1,
  Ljava_io_Serializable: 1
}, (void 0), (void 0), (function(x) {
  return (x === (void 0))
}));
/** @constructor */
function $c_sr_IntRef() {
  $c_O.call(this);
  this.elem$1 = 0
}
$c_sr_IntRef.prototype = new $h_O();
$c_sr_IntRef.prototype.constructor = $c_sr_IntRef;
/** @constructor */
function $h_sr_IntRef() {
  /*<skip>*/
}
$h_sr_IntRef.prototype = $c_sr_IntRef.prototype;
$c_sr_IntRef.prototype.toString__T = (function() {
  var i = this.elem$1;
  return ("" + i)
});
$c_sr_IntRef.prototype.init___I = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_IntRef = new $TypeData().initClass({
  sr_IntRef: 0
}, false, "scala.runtime.IntRef", {
  sr_IntRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_IntRef.prototype.$classData = $d_sr_IntRef;
/** @constructor */
function $c_sr_ObjectRef() {
  $c_O.call(this);
  this.elem$1 = null
}
$c_sr_ObjectRef.prototype = new $h_O();
$c_sr_ObjectRef.prototype.constructor = $c_sr_ObjectRef;
/** @constructor */
function $h_sr_ObjectRef() {
  /*<skip>*/
}
$h_sr_ObjectRef.prototype = $c_sr_ObjectRef.prototype;
$c_sr_ObjectRef.prototype.toString__T = (function() {
  var obj = this.elem$1;
  return ("" + obj)
});
$c_sr_ObjectRef.prototype.init___O = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_ObjectRef = new $TypeData().initClass({
  sr_ObjectRef: 0
}, false, "scala.runtime.ObjectRef", {
  sr_ObjectRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_ObjectRef.prototype.$classData = $d_sr_ObjectRef;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype.japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T = (function(toString) {
  var thiz = $m_sjsr_RuntimeString$().replaceAll__T__T__T__T(toString, "undefined \u2192 undefined", "undefined");
  var thiz$1 = $as_T(thiz.split("props: undefined, ").join(""));
  var thiz$2 = $as_T(thiz$1.split("state: undefined)").join(")"));
  return $as_T(thiz$2.split(", )").join(")"))
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$;
var $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ = (void 0);
function $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$() {
  if ((!$n_Ljapgolly_scalajs_react_component_builder_Lifecycle$)) {
    $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$ = new $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$().init___()
  };
  return $n_Ljapgolly_scalajs_react_component_builder_Lifecycle$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Attr$Event() {
  $c_Ljapgolly_scalajs_react_vdom_Attr$Generic.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype = new $h_Ljapgolly_scalajs_react_vdom_Attr$Generic();
$c_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Attr$Event;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Attr$Event() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype = $c_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype;
$c_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype.init___T = (function(name) {
  $c_Ljapgolly_scalajs_react_vdom_Attr.prototype.init___T.call(this, name);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Attr$Event = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Attr$Event: 0
}, false, "japgolly.scalajs.react.vdom.Attr$Event", {
  Ljapgolly_scalajs_react_vdom_Attr$Event: 1,
  Ljapgolly_scalajs_react_vdom_Attr$Generic: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_Attr$Event.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Attr$Event;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement() {
  $c_O.call(this);
  this.props$1 = null;
  this.styles$1 = null;
  this.children$1 = null;
  this.key$1 = null;
  this.nonEmptyClassName$1 = null;
  this.addAttr$1 = null;
  this.addClassName$1 = null;
  this.addStyle$1 = null;
  this.addStylesObject$1 = null;
  this.appendChild$1 = null;
  this.setKey$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype = $c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype;
$c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype.init___ = (function() {
  $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__$$init$__V(this);
  return this
});
$c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype.render__T__Ljapgolly_scalajs_react_vdom_VdomElement = (function(tag) {
  $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__addClassNameToProps__V(this);
  $f_Ljapgolly_scalajs_react_vdom_Builder$ToJs__addStyleToProps__V(this);
  var e = $m_Ljapgolly_scalajs_react_vdom_Builder$ToRawReactElement$().build$1.apply__O__O__O__O__O(tag, this.props$1, this.key$1, this.children$1);
  return new $c_Ljapgolly_scalajs_react_vdom_VdomElement().init___Ljapgolly_scalajs_react_raw_React$Element(e)
});
var $d_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement: 0
}, false, "japgolly.scalajs.react.vdom.Builder$ToVdomElement", {
  Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Builder$ToJs: 1,
  Ljapgolly_scalajs_react_vdom_Builder: 1
});
$c_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Builder$ToVdomElement;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$() {
  $c_Ljapgolly_scalajs_react_vdom_Style.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype = new $h_Ljapgolly_scalajs_react_vdom_Style();
$c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype = $c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype;
$c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype.init___Ljapgolly_scalajs_react_vdom_HtmlStyles = (function($$outer) {
  $c_Ljapgolly_scalajs_react_vdom_Style.prototype.init___T.call(this, "position");
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_HtmlStyles$position$: 0
}, false, "japgolly.scalajs.react.vdom.HtmlStyles$position$", {
  Ljapgolly_scalajs_react_vdom_HtmlStyles$position$: 1,
  Ljapgolly_scalajs_react_vdom_Style: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle() {
  $c_Ljapgolly_scalajs_react_vdom_Style.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype = new $h_Ljapgolly_scalajs_react_vdom_Style();
$c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype = $c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype;
$c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype.init___T = (function(name) {
  $c_Ljapgolly_scalajs_react_vdom_Style.prototype.init___T.call(this, name);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle: 0
}, false, "japgolly.scalajs.react.vdom.HtmlStylesStatic$AutoStyle", {
  Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle: 1,
  Ljapgolly_scalajs_react_vdom_Style: 1,
  Ljapgolly_scalajs_react_vdom_Attr: 1,
  O: 1
});
$c_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_HtmlStylesStatic$AutoStyle;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_HtmlTagOf$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype = $c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype;
$c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype.apply$extension__T__sc_Seq__Ljapgolly_scalajs_react_vdom_TagOf = (function($$this, xs) {
  var this$1 = $m_sci_Nil$();
  return new $c_Ljapgolly_scalajs_react_vdom_TagOf().init___T__sci_List__T($$this, new $c_sci_$colon$colon().init___O__sci_List(xs, this$1), $m_Ljapgolly_scalajs_react_vdom_Namespace$().Html$1)
});
var $d_Ljapgolly_scalajs_react_vdom_HtmlTagOf$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_HtmlTagOf$: 0
}, false, "japgolly.scalajs.react.vdom.HtmlTagOf$", {
  Ljapgolly_scalajs_react_vdom_HtmlTagOf$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_HtmlTagOf$;
var $n_Ljapgolly_scalajs_react_vdom_HtmlTagOf$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_HtmlTagOf$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_HtmlTagOf$)) {
    $n_Ljapgolly_scalajs_react_vdom_HtmlTagOf$ = new $c_Ljapgolly_scalajs_react_vdom_HtmlTagOf$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_HtmlTagOf$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_Namespace$() {
  $c_O.call(this);
  this.Html$1 = null;
  this.Svg$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_Namespace$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_Namespace$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_Namespace$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_Namespace$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_Namespace$.prototype = $c_Ljapgolly_scalajs_react_vdom_Namespace$.prototype;
$c_Ljapgolly_scalajs_react_vdom_Namespace$.prototype.init___ = (function() {
  this.Html$1 = "http://www.w3.org/1999/xhtml";
  this.Svg$1 = "http://www.w3.org/2000/svg";
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_Namespace$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_Namespace$: 0
}, false, "japgolly.scalajs.react.vdom.Namespace$", {
  Ljapgolly_scalajs_react_vdom_Namespace$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_Namespace$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_Namespace$;
var $n_Ljapgolly_scalajs_react_vdom_Namespace$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_Namespace$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_Namespace$)) {
    $n_Ljapgolly_scalajs_react_vdom_Namespace$ = new $c_Ljapgolly_scalajs_react_vdom_Namespace$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_Namespace$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_SvgTagOf$() {
  $c_O.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_SvgTagOf$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_SvgTagOf$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype = $c_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype;
$c_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype.init___ = (function() {
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_SvgTagOf$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_SvgTagOf$: 0
}, false, "japgolly.scalajs.react.vdom.SvgTagOf$", {
  Ljapgolly_scalajs_react_vdom_SvgTagOf$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_SvgTagOf$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_SvgTagOf$;
var $n_Ljapgolly_scalajs_react_vdom_SvgTagOf$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_SvgTagOf$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_SvgTagOf$)) {
    $n_Ljapgolly_scalajs_react_vdom_SvgTagOf$ = new $c_Ljapgolly_scalajs_react_vdom_SvgTagOf$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_SvgTagOf$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomArray() {
  $c_Ljapgolly_scalajs_react_vdom_VdomNode.call(this);
  this.rawArray$2 = null
}
$c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype = new $h_Ljapgolly_scalajs_react_vdom_VdomNode();
$c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomArray;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomArray() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomArray.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype.$$plus$plus$eq__sc_TraversableOnce__F1__Ljapgolly_scalajs_react_vdom_VdomArray = (function(as, f) {
  as.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1) {
    return (function(a$2) {
      return $uI($this.rawArray$2.push($as_Ljapgolly_scalajs_react_vdom_VdomNode(f$1.apply__O__O(a$2)).rawNode$1))
    })
  })(this, f)));
  return this
});
$c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype.init___sjs_js_Array = (function(rawArray) {
  this.rawArray$2 = rawArray;
  $c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.init___sjs_js_$bar.call(this, rawArray);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_VdomArray = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomArray: 0
}, false, "japgolly.scalajs.react.vdom.VdomArray", {
  Ljapgolly_scalajs_react_vdom_VdomArray: 1,
  Ljapgolly_scalajs_react_vdom_VdomNode: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomArray.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomArray;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_VdomElement() {
  $c_Ljapgolly_scalajs_react_vdom_VdomNode.call(this);
  this.rawElement$2 = null
}
$c_Ljapgolly_scalajs_react_vdom_VdomElement.prototype = new $h_Ljapgolly_scalajs_react_vdom_VdomNode();
$c_Ljapgolly_scalajs_react_vdom_VdomElement.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_VdomElement;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_VdomElement() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_VdomElement.prototype = $c_Ljapgolly_scalajs_react_vdom_VdomElement.prototype;
$c_Ljapgolly_scalajs_react_vdom_VdomElement.prototype.init___Ljapgolly_scalajs_react_raw_React$Element = (function(rawElement) {
  this.rawElement$2 = rawElement;
  $c_Ljapgolly_scalajs_react_vdom_VdomNode.prototype.init___sjs_js_$bar.call(this, rawElement);
  return this
});
function $is_Ljapgolly_scalajs_react_vdom_VdomElement(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_VdomElement)))
}
function $as_Ljapgolly_scalajs_react_vdom_VdomElement(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_VdomElement(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.VdomElement"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_VdomElement(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_VdomElement)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_VdomElement(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_VdomElement(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.VdomElement;", depth))
}
var $d_Ljapgolly_scalajs_react_vdom_VdomElement = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_VdomElement: 0
}, false, "japgolly.scalajs.react.vdom.VdomElement", {
  Ljapgolly_scalajs_react_vdom_VdomElement: 1,
  Ljapgolly_scalajs_react_vdom_VdomNode: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1
});
$c_Ljapgolly_scalajs_react_vdom_VdomElement.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_VdomElement;
/** @constructor */
function $c_Lorg_rebeam_MultiSelect$Props$() {
  $c_O.call(this)
}
$c_Lorg_rebeam_MultiSelect$Props$.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelect$Props$.prototype.constructor = $c_Lorg_rebeam_MultiSelect$Props$;
/** @constructor */
function $h_Lorg_rebeam_MultiSelect$Props$() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelect$Props$.prototype = $c_Lorg_rebeam_MultiSelect$Props$.prototype;
$c_Lorg_rebeam_MultiSelect$Props$.prototype.init___ = (function() {
  return this
});
$c_Lorg_rebeam_MultiSelect$Props$.prototype.apply$default$5__F2 = (function() {
  return new $c_sjsr_AnonFunction2().init___sjs_js_Function2((function($this) {
    return (function(x$1$2, i$2) {
      var i = $uI(i$2);
      return ("" + i)
    })
  })(this))
});
$c_Lorg_rebeam_MultiSelect$Props$.prototype.toString__T = (function() {
  return "Props"
});
var $d_Lorg_rebeam_MultiSelect$Props$ = new $TypeData().initClass({
  Lorg_rebeam_MultiSelect$Props$: 0
}, false, "org.rebeam.MultiSelect$Props$", {
  Lorg_rebeam_MultiSelect$Props$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelect$Props$.prototype.$classData = $d_Lorg_rebeam_MultiSelect$Props$;
var $n_Lorg_rebeam_MultiSelect$Props$ = (void 0);
function $m_Lorg_rebeam_MultiSelect$Props$() {
  if ((!$n_Lorg_rebeam_MultiSelect$Props$)) {
    $n_Lorg_rebeam_MultiSelect$Props$ = new $c_Lorg_rebeam_MultiSelect$Props$().init___()
  };
  return $n_Lorg_rebeam_MultiSelect$Props$
}
/** @constructor */
function $c_Lorg_rebeam_mui_styles_Style$() {
  $c_O.call(this)
}
$c_Lorg_rebeam_mui_styles_Style$.prototype = new $h_O();
$c_Lorg_rebeam_mui_styles_Style$.prototype.constructor = $c_Lorg_rebeam_mui_styles_Style$;
/** @constructor */
function $h_Lorg_rebeam_mui_styles_Style$() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_styles_Style$.prototype = $c_Lorg_rebeam_mui_styles_Style$.prototype;
$c_Lorg_rebeam_mui_styles_Style$.prototype.init___ = (function() {
  return this
});
$c_Lorg_rebeam_mui_styles_Style$.prototype.toString$extension__sjs_js_Object__T = (function($$this) {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(new $c_Lorg_rebeam_mui_styles_Style().init___sjs_js_Object($$this))
});
$c_Lorg_rebeam_mui_styles_Style$.prototype.equals$extension__sjs_js_Object__O__Z = (function($$this, x$1) {
  if ($is_Lorg_rebeam_mui_styles_Style(x$1)) {
    var Style$1 = ((x$1 === null) ? null : $as_Lorg_rebeam_mui_styles_Style(x$1).o$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z($$this, Style$1)
  } else {
    return false
  }
});
$c_Lorg_rebeam_mui_styles_Style$.prototype.productIterator$extension__sjs_js_Object__sc_Iterator = (function($$this) {
  var x = new $c_Lorg_rebeam_mui_styles_Style().init___sjs_js_Object($$this);
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(x)
});
$c_Lorg_rebeam_mui_styles_Style$.prototype.productElement$extension__sjs_js_Object__I__O = (function($$this, x$1) {
  switch (x$1) {
    case 0: {
      return $$this;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
var $d_Lorg_rebeam_mui_styles_Style$ = new $TypeData().initClass({
  Lorg_rebeam_mui_styles_Style$: 0
}, false, "org.rebeam.mui.styles.Style$", {
  Lorg_rebeam_mui_styles_Style$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_mui_styles_Style$.prototype.$classData = $d_Lorg_rebeam_mui_styles_Style$;
var $n_Lorg_rebeam_mui_styles_Style$ = (void 0);
function $m_Lorg_rebeam_mui_styles_Style$() {
  if ((!$n_Lorg_rebeam_mui_styles_Style$)) {
    $n_Lorg_rebeam_mui_styles_Style$ = new $c_Lorg_rebeam_mui_styles_Style$().init___()
  };
  return $n_Lorg_rebeam_mui_styles_Style$
}
var $d_jl_Boolean = new $TypeData().initClass({
  jl_Boolean: 0
}, false, "java.lang.Boolean", {
  jl_Boolean: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "boolean")
}));
/** @constructor */
function $c_jl_Character() {
  $c_O.call(this);
  this.value$1 = 0
}
$c_jl_Character.prototype = new $h_O();
$c_jl_Character.prototype.constructor = $c_jl_Character;
/** @constructor */
function $h_jl_Character() {
  /*<skip>*/
}
$h_jl_Character.prototype = $c_jl_Character.prototype;
$c_jl_Character.prototype.equals__O__Z = (function(that) {
  if ($is_jl_Character(that)) {
    var jsx$1 = this.value$1;
    var this$1 = $as_jl_Character(that);
    return (jsx$1 === this$1.value$1)
  } else {
    return false
  }
});
$c_jl_Character.prototype.toString__T = (function() {
  var c = this.value$1;
  return $as_T($g.String.fromCharCode(c))
});
$c_jl_Character.prototype.init___C = (function(value) {
  this.value$1 = value;
  return this
});
$c_jl_Character.prototype.hashCode__I = (function() {
  return this.value$1
});
function $is_jl_Character(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Character)))
}
function $as_jl_Character(obj) {
  return (($is_jl_Character(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Character"))
}
function $isArrayOf_jl_Character(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Character)))
}
function $asArrayOf_jl_Character(obj, depth) {
  return (($isArrayOf_jl_Character(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Character;", depth))
}
var $d_jl_Character = new $TypeData().initClass({
  jl_Character: 0
}, false, "java.lang.Character", {
  jl_Character: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
});
$c_jl_Character.prototype.$classData = $d_jl_Character;
/** @constructor */
function $c_jl_Character$() {
  $c_O.call(this);
  this.java$lang$Character$$charTypesFirst256$1 = null;
  this.charTypeIndices$1 = null;
  this.charTypes$1 = null;
  this.isMirroredIndices$1 = null;
  this.nonASCIIZeroDigitCodePoints$1 = null;
  this.bitmap$0$1 = 0
}
$c_jl_Character$.prototype = new $h_O();
$c_jl_Character$.prototype.constructor = $c_jl_Character$;
/** @constructor */
function $h_jl_Character$() {
  /*<skip>*/
}
$h_jl_Character$.prototype = $c_jl_Character$.prototype;
$c_jl_Character$.prototype.init___ = (function() {
  return this
});
$c_jl_Character$.prototype.digitWithValidRadix__I__I__I = (function(codePoint, radix) {
  if ((codePoint < 256)) {
    var value = (((codePoint >= 48) && (codePoint <= 57)) ? (((-48) + codePoint) | 0) : (((codePoint >= 65) && (codePoint <= 90)) ? (((-55) + codePoint) | 0) : (((codePoint >= 97) && (codePoint <= 122)) ? (((-87) + codePoint) | 0) : (-1))))
  } else if (((codePoint >= 65313) && (codePoint <= 65338))) {
    var value = (((-65303) + codePoint) | 0)
  } else if (((codePoint >= 65345) && (codePoint <= 65370))) {
    var value = (((-65335) + codePoint) | 0)
  } else {
    var p = $m_ju_Arrays$().binarySearch__AI__I__I(this.nonASCIIZeroDigitCodePoints__p1__AI(), codePoint);
    var zeroCodePointIndex = ((p < 0) ? (((-2) - p) | 0) : p);
    if ((zeroCodePointIndex < 0)) {
      var value = (-1)
    } else {
      var v = ((codePoint - this.nonASCIIZeroDigitCodePoints__p1__AI().get(zeroCodePointIndex)) | 0);
      var value = ((v > 9) ? (-1) : v)
    }
  };
  return ((value < radix) ? value : (-1))
});
$c_jl_Character$.prototype.nonASCIIZeroDigitCodePoints__p1__AI = (function() {
  return (((((16 & this.bitmap$0$1) << 24) >> 24) === 0) ? this.nonASCIIZeroDigitCodePoints$lzycompute__p1__AI() : this.nonASCIIZeroDigitCodePoints$1)
});
$c_jl_Character$.prototype.nonASCIIZeroDigitCodePoints$lzycompute__p1__AI = (function() {
  if (((((16 & this.bitmap$0$1) << 24) >> 24) === 0)) {
    var array = [1632, 1776, 1984, 2406, 2534, 2662, 2790, 2918, 3046, 3174, 3302, 3430, 3664, 3792, 3872, 4160, 4240, 6112, 6160, 6470, 6608, 6784, 6800, 6992, 7088, 7232, 7248, 42528, 43216, 43264, 43472, 43600, 44016, 65296, 66720, 69734, 69872, 69942, 70096, 71360, 120782, 120792, 120802, 120812, 120822];
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
    var len = $uI(xs.array$6.length);
    var array$1 = $newArrayObject($d_I.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$7 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6.length));
    while (this$7.hasNext__Z()) {
      var arg1 = this$7.next__O();
      array$1.set(elem$1, $uI(arg1));
      elem$1 = ((1 + elem$1) | 0)
    };
    this.nonASCIIZeroDigitCodePoints$1 = array$1;
    this.bitmap$0$1 = (((16 | this.bitmap$0$1) << 24) >> 24)
  };
  return this.nonASCIIZeroDigitCodePoints$1
});
var $d_jl_Character$ = new $TypeData().initClass({
  jl_Character$: 0
}, false, "java.lang.Character$", {
  jl_Character$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Character$.prototype.$classData = $d_jl_Character$;
var $n_jl_Character$ = (void 0);
function $m_jl_Character$() {
  if ((!$n_jl_Character$)) {
    $n_jl_Character$ = new $c_jl_Character$().init___()
  };
  return $n_jl_Character$
}
/** @constructor */
function $c_jl_Double$() {
  $c_O.call(this);
  this.doubleStrPat$1 = null;
  this.doubleStrHexPat$1 = null;
  this.bitmap$0$1 = 0
}
$c_jl_Double$.prototype = new $h_O();
$c_jl_Double$.prototype.constructor = $c_jl_Double$;
/** @constructor */
function $h_jl_Double$() {
  /*<skip>*/
}
$h_jl_Double$.prototype = $c_jl_Double$.prototype;
$c_jl_Double$.prototype.init___ = (function() {
  return this
});
$c_jl_Double$.prototype.compare__D__D__I = (function(a, b) {
  if ((a !== a)) {
    return ((b !== b) ? 0 : 1)
  } else if ((b !== b)) {
    return (-1)
  } else if ((a === b)) {
    if ((a === 0.0)) {
      var ainf = (1.0 / a);
      return ((ainf === (1.0 / b)) ? 0 : ((ainf < 0) ? (-1) : 1))
    } else {
      return 0
    }
  } else {
    return ((a < b) ? (-1) : 1)
  }
});
var $d_jl_Double$ = new $TypeData().initClass({
  jl_Double$: 0
}, false, "java.lang.Double$", {
  jl_Double$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Double$.prototype.$classData = $d_jl_Double$;
var $n_jl_Double$ = (void 0);
function $m_jl_Double$() {
  if ((!$n_jl_Double$)) {
    $n_jl_Double$ = new $c_jl_Double$().init___()
  };
  return $n_jl_Double$
}
/** @constructor */
function $c_jl_Error() {
  $c_jl_Throwable.call(this)
}
$c_jl_Error.prototype = new $h_jl_Throwable();
$c_jl_Error.prototype.constructor = $c_jl_Error;
/** @constructor */
function $h_jl_Error() {
  /*<skip>*/
}
$h_jl_Error.prototype = $c_jl_Error.prototype;
/** @constructor */
function $c_jl_Exception() {
  $c_jl_Throwable.call(this)
}
$c_jl_Exception.prototype = new $h_jl_Throwable();
$c_jl_Exception.prototype.constructor = $c_jl_Exception;
/** @constructor */
function $h_jl_Exception() {
  /*<skip>*/
}
$h_jl_Exception.prototype = $c_jl_Exception.prototype;
/** @constructor */
function $c_jl_Integer$() {
  $c_O.call(this)
}
$c_jl_Integer$.prototype = new $h_O();
$c_jl_Integer$.prototype.constructor = $c_jl_Integer$;
/** @constructor */
function $h_jl_Integer$() {
  /*<skip>*/
}
$h_jl_Integer$.prototype = $c_jl_Integer$.prototype;
$c_jl_Integer$.prototype.init___ = (function() {
  return this
});
$c_jl_Integer$.prototype.fail$1__p1__T__sr_Nothing$ = (function(s$1) {
  throw new $c_jl_NumberFormatException().init___T((("For input string: \"" + s$1) + "\""))
});
$c_jl_Integer$.prototype.parseInt__T__I__I = (function(s, radix) {
  var len = ((s === null) ? 0 : $uI(s.length));
  if ((((len === 0) || (radix < 2)) || (radix > 36))) {
    this.fail$1__p1__T__sr_Nothing$(s)
  };
  var firstChar = (65535 & $uI(s.charCodeAt(0)));
  var negative = (firstChar === 45);
  var maxAbsValue = (negative ? 2.147483648E9 : 2.147483647E9);
  var i = ((negative || (firstChar === 43)) ? 1 : 0);
  if ((i >= $uI(s.length))) {
    this.fail$1__p1__T__sr_Nothing$(s)
  };
  var result = 0.0;
  while ((i !== len)) {
    var jsx$1 = $m_jl_Character$();
    var index = i;
    var digit = jsx$1.digitWithValidRadix__I__I__I((65535 & $uI(s.charCodeAt(index))), radix);
    result = ((result * radix) + digit);
    if (((digit === (-1)) || (result > maxAbsValue))) {
      this.fail$1__p1__T__sr_Nothing$(s)
    };
    i = ((1 + i) | 0)
  };
  if (negative) {
    var n = (-result);
    return $uI((n | 0))
  } else {
    var n$1 = result;
    return $uI((n$1 | 0))
  }
});
var $d_jl_Integer$ = new $TypeData().initClass({
  jl_Integer$: 0
}, false, "java.lang.Integer$", {
  jl_Integer$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Integer$.prototype.$classData = $d_jl_Integer$;
var $n_jl_Integer$ = (void 0);
function $m_jl_Integer$() {
  if ((!$n_jl_Integer$)) {
    $n_jl_Integer$ = new $c_jl_Integer$().init___()
  };
  return $n_jl_Integer$
}
/** @constructor */
function $c_jl_Long$() {
  $c_O.call(this);
  this.StringRadixInfos$1 = null;
  this.bitmap$0$1 = false
}
$c_jl_Long$.prototype = new $h_O();
$c_jl_Long$.prototype.constructor = $c_jl_Long$;
/** @constructor */
function $h_jl_Long$() {
  /*<skip>*/
}
$h_jl_Long$.prototype = $c_jl_Long$.prototype;
$c_jl_Long$.prototype.init___ = (function() {
  return this
});
$c_jl_Long$.prototype.java$lang$Long$$toHexString__I__I__T = (function(lo, hi) {
  if ((hi !== 0)) {
    var x = $uD((hi >>> 0));
    var jsx$3 = x.toString(16);
    var jsx$2 = $as_T(jsx$3);
    var x$1 = $uD((lo >>> 0));
    var jsx$1 = x$1.toString(16);
    var s = $as_T(jsx$1);
    var beginIndex = $uI(s.length);
    return (jsx$2 + (("" + $as_T("00000000".substring(beginIndex))) + s))
  } else {
    var x$2 = $uD((lo >>> 0));
    var jsx$4 = x$2.toString(16);
    return $as_T(jsx$4)
  }
});
$c_jl_Long$.prototype.java$lang$Long$$toOctalString__I__I__T = (function(lo, hi) {
  var lp = (1073741823 & lo);
  var mp = (1073741823 & ((((lo >>> 30) | 0) + (hi << 2)) | 0));
  var hp = ((hi >>> 28) | 0);
  if ((hp !== 0)) {
    var x = $uD((hp >>> 0));
    var jsx$5 = x.toString(8);
    var jsx$4 = $as_T(jsx$5);
    var x$1 = $uD((mp >>> 0));
    var jsx$2 = x$1.toString(8);
    var s = $as_T(jsx$2);
    var beginIndex = $uI(s.length);
    var jsx$3 = $as_T("0000000000".substring(beginIndex));
    var x$2 = $uD((lp >>> 0));
    var jsx$1 = x$2.toString(8);
    var s$1 = $as_T(jsx$1);
    var beginIndex$1 = $uI(s$1.length);
    return ((jsx$4 + (("" + jsx$3) + s)) + (("" + $as_T("0000000000".substring(beginIndex$1))) + s$1))
  } else if ((mp !== 0)) {
    var x$3 = $uD((mp >>> 0));
    var jsx$8 = x$3.toString(8);
    var jsx$7 = $as_T(jsx$8);
    var x$4 = $uD((lp >>> 0));
    var jsx$6 = x$4.toString(8);
    var s$2 = $as_T(jsx$6);
    var beginIndex$2 = $uI(s$2.length);
    return (jsx$7 + (("" + $as_T("0000000000".substring(beginIndex$2))) + s$2))
  } else {
    var x$5 = $uD((lp >>> 0));
    var jsx$9 = x$5.toString(8);
    return $as_T(jsx$9)
  }
});
var $d_jl_Long$ = new $TypeData().initClass({
  jl_Long$: 0
}, false, "java.lang.Long$", {
  jl_Long$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Long$.prototype.$classData = $d_jl_Long$;
var $n_jl_Long$ = (void 0);
function $m_jl_Long$() {
  if ((!$n_jl_Long$)) {
    $n_jl_Long$ = new $c_jl_Long$().init___()
  };
  return $n_jl_Long$
}
/** @constructor */
function $c_ju_regex_Pattern() {
  $c_O.call(this);
  this.jsRegExp$1 = null;
  this.$$undpattern$1 = null;
  this.$$undflags$1 = 0
}
$c_ju_regex_Pattern.prototype = new $h_O();
$c_ju_regex_Pattern.prototype.constructor = $c_ju_regex_Pattern;
/** @constructor */
function $h_ju_regex_Pattern() {
  /*<skip>*/
}
$h_ju_regex_Pattern.prototype = $c_ju_regex_Pattern.prototype;
$c_ju_regex_Pattern.prototype.init___sjs_js_RegExp__T__I = (function(jsRegExp, _pattern, _flags) {
  this.jsRegExp$1 = jsRegExp;
  this.$$undpattern$1 = _pattern;
  this.$$undflags$1 = _flags;
  return this
});
$c_ju_regex_Pattern.prototype.toString__T = (function() {
  return this.$$undpattern$1
});
$c_ju_regex_Pattern.prototype.split__jl_CharSequence__I__AT = (function(input, limit) {
  var inputStr = $objectToString(input);
  if ((inputStr === "")) {
    var array = [""];
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
    var len = $uI(xs.array$6.length);
    var array$1 = $newArrayObject($d_T.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$6 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6.length));
    while (this$6.hasNext__Z()) {
      var arg1 = this$6.next__O();
      array$1.set(elem$1, arg1);
      elem$1 = ((1 + elem$1) | 0)
    };
    return array$1
  } else {
    var lim = ((limit > 0) ? limit : 2147483647);
    var matcher = new $c_ju_regex_Matcher().init___ju_regex_Pattern__jl_CharSequence__I__I(this, inputStr, 0, $uI(inputStr.length));
    var elems$2 = null;
    elems$2 = [];
    var prevEnd = 0;
    var size = 0;
    while (((size < (((-1) + lim) | 0)) && matcher.find__Z())) {
      if ((matcher.end__I() !== 0)) {
        var beginIndex = prevEnd;
        var endIndex = matcher.start__I();
        var elem = $as_T(inputStr.substring(beginIndex, endIndex));
        var unboxedElem = ((elem === null) ? null : elem);
        elems$2.push(unboxedElem);
        size = ((1 + size) | 0)
      };
      prevEnd = matcher.end__I()
    };
    var beginIndex$1 = prevEnd;
    var elem$2 = $as_T(inputStr.substring(beginIndex$1));
    var unboxedElem$1 = ((elem$2 === null) ? null : elem$2);
    elems$2.push(unboxedElem$1);
    var result = $makeNativeArrayWrapper($d_T.getArrayOf(), elems$2);
    if ((limit !== 0)) {
      return result
    } else {
      var actualLength = result.u.length;
      while (((actualLength !== 0) && (result.get((((-1) + actualLength) | 0)) === ""))) {
        actualLength = (((-1) + actualLength) | 0)
      };
      if ((actualLength === result.u.length)) {
        return result
      } else {
        var actualResult = $newArrayObject($d_T.getArrayOf(), [actualLength]);
        $systemArraycopy(result, 0, actualResult, 0, actualLength);
        return actualResult
      }
    }
  }
});
$c_ju_regex_Pattern.prototype.newJSRegExp__sjs_js_RegExp = (function() {
  var r = new $g.RegExp(this.jsRegExp$1);
  if ((r !== this.jsRegExp$1)) {
    return r
  } else {
    var jsFlags = ((($uZ(this.jsRegExp$1.global) ? "g" : "") + ($uZ(this.jsRegExp$1.ignoreCase) ? "i" : "")) + ($uZ(this.jsRegExp$1.multiline) ? "m" : ""));
    return new $g.RegExp($as_T(this.jsRegExp$1.source), jsFlags)
  }
});
var $d_ju_regex_Pattern = new $TypeData().initClass({
  ju_regex_Pattern: 0
}, false, "java.util.regex.Pattern", {
  ju_regex_Pattern: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_regex_Pattern.prototype.$classData = $d_ju_regex_Pattern;
/** @constructor */
function $c_ju_regex_Pattern$() {
  $c_O.call(this);
  this.java$util$regex$Pattern$$splitHackPat$1 = null;
  this.java$util$regex$Pattern$$flagHackPat$1 = null
}
$c_ju_regex_Pattern$.prototype = new $h_O();
$c_ju_regex_Pattern$.prototype.constructor = $c_ju_regex_Pattern$;
/** @constructor */
function $h_ju_regex_Pattern$() {
  /*<skip>*/
}
$h_ju_regex_Pattern$.prototype = $c_ju_regex_Pattern$.prototype;
$c_ju_regex_Pattern$.prototype.init___ = (function() {
  $n_ju_regex_Pattern$ = this;
  this.java$util$regex$Pattern$$splitHackPat$1 = new $g.RegExp("^\\\\Q(.|\\n|\\r)\\\\E$");
  this.java$util$regex$Pattern$$flagHackPat$1 = new $g.RegExp("^\\(\\?([idmsuxU]*)(?:-([idmsuxU]*))?\\)");
  return this
});
$c_ju_regex_Pattern$.prototype.compile__T__I__ju_regex_Pattern = (function(regex, flags) {
  if (((16 & flags) !== 0)) {
    var x1 = new $c_T2().init___O__O(this.quote__T__T(regex), flags)
  } else {
    var m = this.java$util$regex$Pattern$$splitHackPat$1.exec(regex);
    if ((m !== null)) {
      var value = m[1];
      if ((value === (void 0))) {
        throw new $c_ju_NoSuchElementException().init___T("undefined.get")
      };
      var this$5 = new $c_s_Some().init___O(new $c_T2().init___O__O(this.quote__T__T($as_T(value)), flags))
    } else {
      var this$5 = $m_s_None$()
    };
    if (this$5.isEmpty__Z()) {
      var this$6 = $m_ju_regex_Pattern$();
      var m$1 = this$6.java$util$regex$Pattern$$flagHackPat$1.exec(regex);
      if ((m$1 !== null)) {
        var value$1 = m$1[0];
        if ((value$1 === (void 0))) {
          throw new $c_ju_NoSuchElementException().init___T("undefined.get")
        };
        var thiz = $as_T(value$1);
        var beginIndex = $uI(thiz.length);
        var newPat = $as_T(regex.substring(beginIndex));
        var value$2 = m$1[1];
        if ((value$2 === (void 0))) {
          var flags1 = flags
        } else {
          var chars = $as_T(value$2);
          var this$20 = new $c_sci_StringOps().init___T(chars);
          var start = 0;
          var $$this = this$20.repr$1;
          var end = $uI($$this.length);
          var z = flags;
          var start$1 = start;
          var z$1 = z;
          var jsx$1;
          _foldl: while (true) {
            if ((start$1 !== end)) {
              var temp$start = ((1 + start$1) | 0);
              var arg1 = z$1;
              var arg2 = this$20.apply__I__O(start$1);
              var f = $uI(arg1);
              if ((arg2 === null)) {
                var c = 0
              } else {
                var this$24 = $as_jl_Character(arg2);
                var c = this$24.value$1
              };
              var temp$z = (f | $m_ju_regex_Pattern$().java$util$regex$Pattern$$charToFlag__C__I(c));
              start$1 = temp$start;
              z$1 = temp$z;
              continue _foldl
            };
            var jsx$1 = z$1;
            break
          };
          var flags1 = $uI(jsx$1)
        };
        var value$3 = m$1[2];
        if ((value$3 === (void 0))) {
          var flags2 = flags1
        } else {
          var chars$3 = $as_T(value$3);
          var this$31 = new $c_sci_StringOps().init___T(chars$3);
          var start$2 = 0;
          var $$this$1 = this$31.repr$1;
          var end$1 = $uI($$this$1.length);
          var z$2 = flags1;
          var start$3 = start$2;
          var z$3 = z$2;
          var jsx$2;
          _foldl$1: while (true) {
            if ((start$3 !== end$1)) {
              var temp$start$1 = ((1 + start$3) | 0);
              var arg1$1 = z$3;
              var arg2$1 = this$31.apply__I__O(start$3);
              var f$1 = $uI(arg1$1);
              if ((arg2$1 === null)) {
                var c$1 = 0
              } else {
                var this$35 = $as_jl_Character(arg2$1);
                var c$1 = this$35.value$1
              };
              var temp$z$1 = (f$1 & (~$m_ju_regex_Pattern$().java$util$regex$Pattern$$charToFlag__C__I(c$1)));
              start$3 = temp$start$1;
              z$3 = temp$z$1;
              continue _foldl$1
            };
            var jsx$2 = z$3;
            break
          };
          var flags2 = $uI(jsx$2)
        };
        var this$36 = new $c_s_Some().init___O(new $c_T2().init___O__O(newPat, flags2))
      } else {
        var this$36 = $m_s_None$()
      }
    } else {
      var this$36 = this$5
    };
    var x1 = $as_T2((this$36.isEmpty__Z() ? new $c_T2().init___O__O(regex, flags) : this$36.get__O()))
  };
  if ((x1 === null)) {
    throw new $c_s_MatchError().init___O(x1)
  };
  var jsPattern = $as_T(x1.$$und1$f);
  var flags1$1 = $uI(x1.$$und2$f);
  var jsFlags = (("g" + (((2 & flags1$1) !== 0) ? "i" : "")) + (((8 & flags1$1) !== 0) ? "m" : ""));
  var jsRegExp = new $g.RegExp(jsPattern, jsFlags);
  return new $c_ju_regex_Pattern().init___sjs_js_RegExp__T__I(jsRegExp, regex, flags1$1)
});
$c_ju_regex_Pattern$.prototype.quote__T__T = (function(s) {
  var result = "";
  var i = 0;
  while ((i < $uI(s.length))) {
    var index = i;
    var c = (65535 & $uI(s.charCodeAt(index)));
    var jsx$2 = result;
    switch (c) {
      case 92:
      case 46:
      case 40:
      case 41:
      case 91:
      case 93:
      case 123:
      case 125:
      case 124:
      case 63:
      case 42:
      case 43:
      case 94:
      case 36: {
        var jsx$1 = ("\\" + new $c_jl_Character().init___C(c));
        break
      }
      default: {
        var jsx$1 = new $c_jl_Character().init___C(c)
      }
    };
    result = (("" + jsx$2) + jsx$1);
    i = ((1 + i) | 0)
  };
  return result
});
$c_ju_regex_Pattern$.prototype.java$util$regex$Pattern$$charToFlag__C__I = (function(c) {
  switch (c) {
    case 105: {
      return 2;
      break
    }
    case 100: {
      return 1;
      break
    }
    case 109: {
      return 8;
      break
    }
    case 115: {
      return 32;
      break
    }
    case 117: {
      return 64;
      break
    }
    case 120: {
      return 4;
      break
    }
    case 85: {
      return 256;
      break
    }
    default: {
      throw new $c_jl_IllegalArgumentException().init___T("bad in-pattern flag")
    }
  }
});
var $d_ju_regex_Pattern$ = new $TypeData().initClass({
  ju_regex_Pattern$: 0
}, false, "java.util.regex.Pattern$", {
  ju_regex_Pattern$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_regex_Pattern$.prototype.$classData = $d_ju_regex_Pattern$;
var $n_ju_regex_Pattern$ = (void 0);
function $m_ju_regex_Pattern$() {
  if ((!$n_ju_regex_Pattern$)) {
    $n_ju_regex_Pattern$ = new $c_ju_regex_Pattern$().init___()
  };
  return $n_ju_regex_Pattern$
}
/** @constructor */
function $c_s_Console$() {
  $c_s_DeprecatedConsole.call(this);
  this.outVar$2 = null;
  this.errVar$2 = null;
  this.inVar$2 = null
}
$c_s_Console$.prototype = new $h_s_DeprecatedConsole();
$c_s_Console$.prototype.constructor = $c_s_Console$;
/** @constructor */
function $h_s_Console$() {
  /*<skip>*/
}
$h_s_Console$.prototype = $c_s_Console$.prototype;
$c_s_Console$.prototype.init___ = (function() {
  $n_s_Console$ = this;
  this.outVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().out$1);
  this.errVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().err$1);
  this.inVar$2 = new $c_s_util_DynamicVariable().init___O(null);
  return this
});
var $d_s_Console$ = new $TypeData().initClass({
  s_Console$: 0
}, false, "scala.Console$", {
  s_Console$: 1,
  s_DeprecatedConsole: 1,
  O: 1,
  s_io_AnsiColor: 1
});
$c_s_Console$.prototype.$classData = $d_s_Console$;
var $n_s_Console$ = (void 0);
function $m_s_Console$() {
  if ((!$n_s_Console$)) {
    $n_s_Console$ = new $c_s_Console$().init___()
  };
  return $n_s_Console$
}
/** @constructor */
function $c_s_Option$() {
  $c_O.call(this)
}
$c_s_Option$.prototype = new $h_O();
$c_s_Option$.prototype.constructor = $c_s_Option$;
/** @constructor */
function $h_s_Option$() {
  /*<skip>*/
}
$h_s_Option$.prototype = $c_s_Option$.prototype;
$c_s_Option$.prototype.init___ = (function() {
  return this
});
$c_s_Option$.prototype.apply__O__s_Option = (function(x) {
  return ((x === null) ? $m_s_None$() : new $c_s_Some().init___O(x))
});
var $d_s_Option$ = new $TypeData().initClass({
  s_Option$: 0
}, false, "scala.Option$", {
  s_Option$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Option$.prototype.$classData = $d_s_Option$;
var $n_s_Option$ = (void 0);
function $m_s_Option$() {
  if ((!$n_s_Option$)) {
    $n_s_Option$ = new $c_s_Option$().init___()
  };
  return $n_s_Option$
}
/** @constructor */
function $c_s_math_Fractional$() {
  $c_O.call(this)
}
$c_s_math_Fractional$.prototype = new $h_O();
$c_s_math_Fractional$.prototype.constructor = $c_s_math_Fractional$;
/** @constructor */
function $h_s_math_Fractional$() {
  /*<skip>*/
}
$h_s_math_Fractional$.prototype = $c_s_math_Fractional$.prototype;
$c_s_math_Fractional$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Fractional$ = new $TypeData().initClass({
  s_math_Fractional$: 0
}, false, "scala.math.Fractional$", {
  s_math_Fractional$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Fractional$.prototype.$classData = $d_s_math_Fractional$;
var $n_s_math_Fractional$ = (void 0);
function $m_s_math_Fractional$() {
  if ((!$n_s_math_Fractional$)) {
    $n_s_math_Fractional$ = new $c_s_math_Fractional$().init___()
  };
  return $n_s_math_Fractional$
}
/** @constructor */
function $c_s_math_Integral$() {
  $c_O.call(this)
}
$c_s_math_Integral$.prototype = new $h_O();
$c_s_math_Integral$.prototype.constructor = $c_s_math_Integral$;
/** @constructor */
function $h_s_math_Integral$() {
  /*<skip>*/
}
$h_s_math_Integral$.prototype = $c_s_math_Integral$.prototype;
$c_s_math_Integral$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Integral$ = new $TypeData().initClass({
  s_math_Integral$: 0
}, false, "scala.math.Integral$", {
  s_math_Integral$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Integral$.prototype.$classData = $d_s_math_Integral$;
var $n_s_math_Integral$ = (void 0);
function $m_s_math_Integral$() {
  if ((!$n_s_math_Integral$)) {
    $n_s_math_Integral$ = new $c_s_math_Integral$().init___()
  };
  return $n_s_math_Integral$
}
/** @constructor */
function $c_s_math_Numeric$() {
  $c_O.call(this)
}
$c_s_math_Numeric$.prototype = new $h_O();
$c_s_math_Numeric$.prototype.constructor = $c_s_math_Numeric$;
/** @constructor */
function $h_s_math_Numeric$() {
  /*<skip>*/
}
$h_s_math_Numeric$.prototype = $c_s_math_Numeric$.prototype;
$c_s_math_Numeric$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Numeric$ = new $TypeData().initClass({
  s_math_Numeric$: 0
}, false, "scala.math.Numeric$", {
  s_math_Numeric$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Numeric$.prototype.$classData = $d_s_math_Numeric$;
var $n_s_math_Numeric$ = (void 0);
function $m_s_math_Numeric$() {
  if ((!$n_s_math_Numeric$)) {
    $n_s_math_Numeric$ = new $c_s_math_Numeric$().init___()
  };
  return $n_s_math_Numeric$
}
function $is_s_math_ScalaNumber(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_math_ScalaNumber)))
}
function $as_s_math_ScalaNumber(obj) {
  return (($is_s_math_ScalaNumber(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.math.ScalaNumber"))
}
function $isArrayOf_s_math_ScalaNumber(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_math_ScalaNumber)))
}
function $asArrayOf_s_math_ScalaNumber(obj, depth) {
  return (($isArrayOf_s_math_ScalaNumber(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.math.ScalaNumber;", depth))
}
/** @constructor */
function $c_s_util_Either$() {
  $c_O.call(this)
}
$c_s_util_Either$.prototype = new $h_O();
$c_s_util_Either$.prototype.constructor = $c_s_util_Either$;
/** @constructor */
function $h_s_util_Either$() {
  /*<skip>*/
}
$h_s_util_Either$.prototype = $c_s_util_Either$.prototype;
$c_s_util_Either$.prototype.init___ = (function() {
  return this
});
var $d_s_util_Either$ = new $TypeData().initClass({
  s_util_Either$: 0
}, false, "scala.util.Either$", {
  s_util_Either$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Either$.prototype.$classData = $d_s_util_Either$;
var $n_s_util_Either$ = (void 0);
function $m_s_util_Either$() {
  if ((!$n_s_util_Either$)) {
    $n_s_util_Either$ = new $c_s_util_Either$().init___()
  };
  return $n_s_util_Either$
}
/** @constructor */
function $c_s_util_Left$() {
  $c_O.call(this)
}
$c_s_util_Left$.prototype = new $h_O();
$c_s_util_Left$.prototype.constructor = $c_s_util_Left$;
/** @constructor */
function $h_s_util_Left$() {
  /*<skip>*/
}
$h_s_util_Left$.prototype = $c_s_util_Left$.prototype;
$c_s_util_Left$.prototype.init___ = (function() {
  return this
});
$c_s_util_Left$.prototype.toString__T = (function() {
  return "Left"
});
var $d_s_util_Left$ = new $TypeData().initClass({
  s_util_Left$: 0
}, false, "scala.util.Left$", {
  s_util_Left$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Left$.prototype.$classData = $d_s_util_Left$;
var $n_s_util_Left$ = (void 0);
function $m_s_util_Left$() {
  if ((!$n_s_util_Left$)) {
    $n_s_util_Left$ = new $c_s_util_Left$().init___()
  };
  return $n_s_util_Left$
}
/** @constructor */
function $c_s_util_Right$() {
  $c_O.call(this)
}
$c_s_util_Right$.prototype = new $h_O();
$c_s_util_Right$.prototype.constructor = $c_s_util_Right$;
/** @constructor */
function $h_s_util_Right$() {
  /*<skip>*/
}
$h_s_util_Right$.prototype = $c_s_util_Right$.prototype;
$c_s_util_Right$.prototype.init___ = (function() {
  return this
});
$c_s_util_Right$.prototype.toString__T = (function() {
  return "Right"
});
var $d_s_util_Right$ = new $TypeData().initClass({
  s_util_Right$: 0
}, false, "scala.util.Right$", {
  s_util_Right$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Right$.prototype.$classData = $d_s_util_Right$;
var $n_s_util_Right$ = (void 0);
function $m_s_util_Right$() {
  if ((!$n_s_util_Right$)) {
    $n_s_util_Right$ = new $c_s_util_Right$().init___()
  };
  return $n_s_util_Right$
}
/** @constructor */
function $c_s_util_control_NoStackTrace$() {
  $c_O.call(this);
  this.$$undnoSuppression$1 = false
}
$c_s_util_control_NoStackTrace$.prototype = new $h_O();
$c_s_util_control_NoStackTrace$.prototype.constructor = $c_s_util_control_NoStackTrace$;
/** @constructor */
function $h_s_util_control_NoStackTrace$() {
  /*<skip>*/
}
$h_s_util_control_NoStackTrace$.prototype = $c_s_util_control_NoStackTrace$.prototype;
$c_s_util_control_NoStackTrace$.prototype.init___ = (function() {
  this.$$undnoSuppression$1 = false;
  return this
});
var $d_s_util_control_NoStackTrace$ = new $TypeData().initClass({
  s_util_control_NoStackTrace$: 0
}, false, "scala.util.control.NoStackTrace$", {
  s_util_control_NoStackTrace$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_control_NoStackTrace$.prototype.$classData = $d_s_util_control_NoStackTrace$;
var $n_s_util_control_NoStackTrace$ = (void 0);
function $m_s_util_control_NoStackTrace$() {
  if ((!$n_s_util_control_NoStackTrace$)) {
    $n_s_util_control_NoStackTrace$ = new $c_s_util_control_NoStackTrace$().init___()
  };
  return $n_s_util_control_NoStackTrace$
}
/** @constructor */
function $c_sc_IndexedSeq$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sc_IndexedSeq$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sc_IndexedSeq$$anon$1.prototype.constructor = $c_sc_IndexedSeq$$anon$1;
/** @constructor */
function $h_sc_IndexedSeq$$anon$1() {
  /*<skip>*/
}
$h_sc_IndexedSeq$$anon$1.prototype = $c_sc_IndexedSeq$$anon$1.prototype;
$c_sc_IndexedSeq$$anon$1.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sc_IndexedSeq$());
  return this
});
$c_sc_IndexedSeq$$anon$1.prototype.apply__scm_Builder = (function() {
  $m_sc_IndexedSeq$();
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$$anon$1 = new $TypeData().initClass({
  sc_IndexedSeq$$anon$1: 0
}, false, "scala.collection.IndexedSeq$$anon$1", {
  sc_IndexedSeq$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sc_IndexedSeq$$anon$1.prototype.$classData = $d_sc_IndexedSeq$$anon$1;
/** @constructor */
function $c_scg_GenSeqFactory() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scg_GenSeqFactory.prototype = new $h_scg_GenTraversableFactory();
$c_scg_GenSeqFactory.prototype.constructor = $c_scg_GenSeqFactory;
/** @constructor */
function $h_scg_GenSeqFactory() {
  /*<skip>*/
}
$h_scg_GenSeqFactory.prototype = $c_scg_GenSeqFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this);
  this.$$outer$2 = null
}
$c_scg_GenTraversableFactory$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_scg_GenTraversableFactory$$anon$1.prototype.constructor = $c_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $h_scg_GenTraversableFactory$$anon$1() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$$anon$1.prototype = $c_scg_GenTraversableFactory$$anon$1.prototype;
$c_scg_GenTraversableFactory$$anon$1.prototype.apply__scm_Builder = (function() {
  return this.$$outer$2.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$$anon$1.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $$outer);
  return this
});
var $d_scg_GenTraversableFactory$$anon$1 = new $TypeData().initClass({
  scg_GenTraversableFactory$$anon$1: 0
}, false, "scala.collection.generic.GenTraversableFactory$$anon$1", {
  scg_GenTraversableFactory$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_scg_GenTraversableFactory$$anon$1.prototype.$classData = $d_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $c_sci_$colon$colon$() {
  $c_O.call(this)
}
$c_sci_$colon$colon$.prototype = new $h_O();
$c_sci_$colon$colon$.prototype.constructor = $c_sci_$colon$colon$;
/** @constructor */
function $h_sci_$colon$colon$() {
  /*<skip>*/
}
$h_sci_$colon$colon$.prototype = $c_sci_$colon$colon$.prototype;
$c_sci_$colon$colon$.prototype.init___ = (function() {
  return this
});
$c_sci_$colon$colon$.prototype.toString__T = (function() {
  return "::"
});
var $d_sci_$colon$colon$ = new $TypeData().initClass({
  sci_$colon$colon$: 0
}, false, "scala.collection.immutable.$colon$colon$", {
  sci_$colon$colon$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_$colon$colon$.prototype.$classData = $d_sci_$colon$colon$;
var $n_sci_$colon$colon$ = (void 0);
function $m_sci_$colon$colon$() {
  if ((!$n_sci_$colon$colon$)) {
    $n_sci_$colon$colon$ = new $c_sci_$colon$colon$().init___()
  };
  return $n_sci_$colon$colon$
}
/** @constructor */
function $c_sci_Range$() {
  $c_O.call(this);
  this.MAX$undPRINT$1 = 0
}
$c_sci_Range$.prototype = new $h_O();
$c_sci_Range$.prototype.constructor = $c_sci_Range$;
/** @constructor */
function $h_sci_Range$() {
  /*<skip>*/
}
$h_sci_Range$.prototype = $c_sci_Range$.prototype;
$c_sci_Range$.prototype.init___ = (function() {
  this.MAX$undPRINT$1 = 512;
  return this
});
var $d_sci_Range$ = new $TypeData().initClass({
  sci_Range$: 0
}, false, "scala.collection.immutable.Range$", {
  sci_Range$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range$.prototype.$classData = $d_sci_Range$;
var $n_sci_Range$ = (void 0);
function $m_sci_Range$() {
  if ((!$n_sci_Range$)) {
    $n_sci_Range$ = new $c_sci_Range$().init___()
  };
  return $n_sci_Range$
}
/** @constructor */
function $c_sci_Stream$StreamCanBuildFrom() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sci_Stream$StreamCanBuildFrom.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sci_Stream$StreamCanBuildFrom.prototype.constructor = $c_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $h_sci_Stream$StreamCanBuildFrom() {
  /*<skip>*/
}
$h_sci_Stream$StreamCanBuildFrom.prototype = $c_sci_Stream$StreamCanBuildFrom.prototype;
$c_sci_Stream$StreamCanBuildFrom.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sci_Stream$());
  return this
});
var $d_sci_Stream$StreamCanBuildFrom = new $TypeData().initClass({
  sci_Stream$StreamCanBuildFrom: 0
}, false, "scala.collection.immutable.Stream$StreamCanBuildFrom", {
  sci_Stream$StreamCanBuildFrom: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sci_Stream$StreamCanBuildFrom.prototype.$classData = $d_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $c_scm_StringBuilder$() {
  $c_O.call(this)
}
$c_scm_StringBuilder$.prototype = new $h_O();
$c_scm_StringBuilder$.prototype.constructor = $c_scm_StringBuilder$;
/** @constructor */
function $h_scm_StringBuilder$() {
  /*<skip>*/
}
$h_scm_StringBuilder$.prototype = $c_scm_StringBuilder$.prototype;
$c_scm_StringBuilder$.prototype.init___ = (function() {
  return this
});
var $d_scm_StringBuilder$ = new $TypeData().initClass({
  scm_StringBuilder$: 0
}, false, "scala.collection.mutable.StringBuilder$", {
  scm_StringBuilder$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder$.prototype.$classData = $d_scm_StringBuilder$;
var $n_scm_StringBuilder$ = (void 0);
function $m_scm_StringBuilder$() {
  if ((!$n_scm_StringBuilder$)) {
    $n_scm_StringBuilder$ = new $c_scm_StringBuilder$().init___()
  };
  return $n_scm_StringBuilder$
}
/** @constructor */
function $c_sjs_js_Any$() {
  $c_O.call(this)
}
$c_sjs_js_Any$.prototype = new $h_O();
$c_sjs_js_Any$.prototype.constructor = $c_sjs_js_Any$;
/** @constructor */
function $h_sjs_js_Any$() {
  /*<skip>*/
}
$h_sjs_js_Any$.prototype = $c_sjs_js_Any$.prototype;
$c_sjs_js_Any$.prototype.init___ = (function() {
  return this
});
$c_sjs_js_Any$.prototype.toFunction1__sjs_js_Function1__F1 = (function(f) {
  return new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1) {
    return (function(x1$2) {
      return f$1(x1$2)
    })
  })(this, f))
});
var $d_sjs_js_Any$ = new $TypeData().initClass({
  sjs_js_Any$: 0
}, false, "scala.scalajs.js.Any$", {
  sjs_js_Any$: 1,
  O: 1,
  sjs_js_LowPrioAnyImplicits: 1,
  sjs_js_LowestPrioAnyImplicits: 1
});
$c_sjs_js_Any$.prototype.$classData = $d_sjs_js_Any$;
var $n_sjs_js_Any$ = (void 0);
function $m_sjs_js_Any$() {
  if ((!$n_sjs_js_Any$)) {
    $n_sjs_js_Any$ = new $c_sjs_js_Any$().init___()
  };
  return $n_sjs_js_Any$
}
/** @constructor */
function $c_sjsr_AnonFunction0() {
  $c_sr_AbstractFunction0.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction0.prototype = new $h_sr_AbstractFunction0();
$c_sjsr_AnonFunction0.prototype.constructor = $c_sjsr_AnonFunction0;
/** @constructor */
function $h_sjsr_AnonFunction0() {
  /*<skip>*/
}
$h_sjsr_AnonFunction0.prototype = $c_sjsr_AnonFunction0.prototype;
$c_sjsr_AnonFunction0.prototype.apply__O = (function() {
  return (0, this.f$2)()
});
$c_sjsr_AnonFunction0.prototype.init___sjs_js_Function0 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction0 = new $TypeData().initClass({
  sjsr_AnonFunction0: 0
}, false, "scala.scalajs.runtime.AnonFunction0", {
  sjsr_AnonFunction0: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1
});
$c_sjsr_AnonFunction0.prototype.$classData = $d_sjsr_AnonFunction0;
/** @constructor */
function $c_sjsr_AnonFunction1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction1.prototype = new $h_sr_AbstractFunction1();
$c_sjsr_AnonFunction1.prototype.constructor = $c_sjsr_AnonFunction1;
/** @constructor */
function $h_sjsr_AnonFunction1() {
  /*<skip>*/
}
$h_sjsr_AnonFunction1.prototype = $c_sjsr_AnonFunction1.prototype;
$c_sjsr_AnonFunction1.prototype.apply__O__O = (function(arg1) {
  return (0, this.f$2)(arg1)
});
$c_sjsr_AnonFunction1.prototype.init___sjs_js_Function1 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction1 = new $TypeData().initClass({
  sjsr_AnonFunction1: 0
}, false, "scala.scalajs.runtime.AnonFunction1", {
  sjsr_AnonFunction1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1
});
$c_sjsr_AnonFunction1.prototype.$classData = $d_sjsr_AnonFunction1;
/** @constructor */
function $c_sjsr_AnonFunction2() {
  $c_sr_AbstractFunction2.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction2.prototype = new $h_sr_AbstractFunction2();
$c_sjsr_AnonFunction2.prototype.constructor = $c_sjsr_AnonFunction2;
/** @constructor */
function $h_sjsr_AnonFunction2() {
  /*<skip>*/
}
$h_sjsr_AnonFunction2.prototype = $c_sjsr_AnonFunction2.prototype;
$c_sjsr_AnonFunction2.prototype.init___sjs_js_Function2 = (function(f) {
  this.f$2 = f;
  return this
});
$c_sjsr_AnonFunction2.prototype.apply__O__O__O = (function(arg1, arg2) {
  return (0, this.f$2)(arg1, arg2)
});
var $d_sjsr_AnonFunction2 = new $TypeData().initClass({
  sjsr_AnonFunction2: 0
}, false, "scala.scalajs.runtime.AnonFunction2", {
  sjsr_AnonFunction2: 1,
  sr_AbstractFunction2: 1,
  O: 1,
  F2: 1
});
$c_sjsr_AnonFunction2.prototype.$classData = $d_sjsr_AnonFunction2;
/** @constructor */
function $c_sjsr_AnonFunction3() {
  $c_sr_AbstractFunction3.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction3.prototype = new $h_sr_AbstractFunction3();
$c_sjsr_AnonFunction3.prototype.constructor = $c_sjsr_AnonFunction3;
/** @constructor */
function $h_sjsr_AnonFunction3() {
  /*<skip>*/
}
$h_sjsr_AnonFunction3.prototype = $c_sjsr_AnonFunction3.prototype;
$c_sjsr_AnonFunction3.prototype.init___sjs_js_Function3 = (function(f) {
  this.f$2 = f;
  return this
});
$c_sjsr_AnonFunction3.prototype.apply__O__O__O__O = (function(arg1, arg2, arg3) {
  return (0, this.f$2)(arg1, arg2, arg3)
});
var $d_sjsr_AnonFunction3 = new $TypeData().initClass({
  sjsr_AnonFunction3: 0
}, false, "scala.scalajs.runtime.AnonFunction3", {
  sjsr_AnonFunction3: 1,
  sr_AbstractFunction3: 1,
  O: 1,
  F3: 1
});
$c_sjsr_AnonFunction3.prototype.$classData = $d_sjsr_AnonFunction3;
/** @constructor */
function $c_sjsr_AnonFunction4() {
  $c_sr_AbstractFunction4.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction4.prototype = new $h_sr_AbstractFunction4();
$c_sjsr_AnonFunction4.prototype.constructor = $c_sjsr_AnonFunction4;
/** @constructor */
function $h_sjsr_AnonFunction4() {
  /*<skip>*/
}
$h_sjsr_AnonFunction4.prototype = $c_sjsr_AnonFunction4.prototype;
$c_sjsr_AnonFunction4.prototype.apply__O__O__O__O__O = (function(arg1, arg2, arg3, arg4) {
  return (0, this.f$2)(arg1, arg2, arg3, arg4)
});
$c_sjsr_AnonFunction4.prototype.init___sjs_js_Function4 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction4 = new $TypeData().initClass({
  sjsr_AnonFunction4: 0
}, false, "scala.scalajs.runtime.AnonFunction4", {
  sjsr_AnonFunction4: 1,
  sr_AbstractFunction4: 1,
  O: 1,
  F4: 1
});
$c_sjsr_AnonFunction4.prototype.$classData = $d_sjsr_AnonFunction4;
/** @constructor */
function $c_sjsr_RuntimeLong$() {
  $c_O.call(this);
  this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
  this.Zero$1 = null
}
$c_sjsr_RuntimeLong$.prototype = new $h_O();
$c_sjsr_RuntimeLong$.prototype.constructor = $c_sjsr_RuntimeLong$;
/** @constructor */
function $h_sjsr_RuntimeLong$() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong$.prototype = $c_sjsr_RuntimeLong$.prototype;
$c_sjsr_RuntimeLong$.prototype.init___ = (function() {
  $n_sjsr_RuntimeLong$ = this;
  this.Zero$1 = new $c_sjsr_RuntimeLong().init___I__I(0, 0);
  return this
});
$c_sjsr_RuntimeLong$.prototype.Zero__sjsr_RuntimeLong = (function() {
  return this.Zero$1
});
$c_sjsr_RuntimeLong$.prototype.toUnsignedString__p1__I__I__T = (function(lo, hi) {
  if ((((-2097152) & hi) === 0)) {
    var this$5 = ((4.294967296E9 * hi) + $uD((lo >>> 0)));
    return ("" + this$5)
  } else {
    return $as_T(this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(lo, hi, 1000000000, 0, 2))
  }
});
$c_sjsr_RuntimeLong$.prototype.divideImpl__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if (((blo | bhi) === 0)) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  };
  if ((ahi === (alo >> 31))) {
    if ((bhi === (blo >> 31))) {
      if (((alo === (-2147483648)) && (blo === (-1)))) {
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
        return (-2147483648)
      } else {
        var lo = ((alo / blo) | 0);
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (lo >> 31);
        return lo
      }
    } else if (((alo === (-2147483648)) && ((blo === (-2147483648)) && (bhi === 0)))) {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (-1);
      return (-1)
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    }
  } else {
    var neg = (ahi < 0);
    if (neg) {
      var lo$1 = ((-alo) | 0);
      var hi = ((alo !== 0) ? (~ahi) : ((-ahi) | 0));
      var abs_$_lo$2 = lo$1;
      var abs_$_hi$2 = hi
    } else {
      var abs_$_lo$2 = alo;
      var abs_$_hi$2 = ahi
    };
    var neg$1 = (bhi < 0);
    if (neg$1) {
      var lo$2 = ((-blo) | 0);
      var hi$1 = ((blo !== 0) ? (~bhi) : ((-bhi) | 0));
      var abs$1_$_lo$2 = lo$2;
      var abs$1_$_hi$2 = hi$1
    } else {
      var abs$1_$_lo$2 = blo;
      var abs$1_$_hi$2 = bhi
    };
    var absRLo = this.unsigned$und$div__p1__I__I__I__I__I(abs_$_lo$2, abs_$_hi$2, abs$1_$_lo$2, abs$1_$_hi$2);
    if ((neg === neg$1)) {
      return absRLo
    } else {
      var hi$2 = this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((absRLo !== 0) ? (~hi$2) : ((-hi$2) | 0));
      return ((-absRLo) | 0)
    }
  }
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D = (function(lo, hi) {
  if ((hi < 0)) {
    var x = ((lo !== 0) ? (~hi) : ((-hi) | 0));
    var jsx$1 = $uD((x >>> 0));
    var x$1 = ((-lo) | 0);
    return (-((4.294967296E9 * jsx$1) + $uD((x$1 >>> 0))))
  } else {
    return ((4.294967296E9 * hi) + $uD((lo >>> 0)))
  }
});
$c_sjsr_RuntimeLong$.prototype.fromDouble__D__sjsr_RuntimeLong = (function(value) {
  var lo = this.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I(value);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I = (function(value) {
  if ((value < (-9.223372036854776E18))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (-2147483648);
    return 0
  } else if ((value >= 9.223372036854776E18)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 2147483647;
    return (-1)
  } else {
    var rawLo = $uI((value | 0));
    var x = (value / 4.294967296E9);
    var rawHi = $uI((x | 0));
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (((value < 0) && (rawLo !== 0)) ? (((-1) + rawHi) | 0) : rawHi);
    return rawLo
  }
});
$c_sjsr_RuntimeLong$.prototype.unsigned$und$div__p1__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if ((((-2097152) & ahi) === 0)) {
    if ((((-2097152) & bhi) === 0)) {
      var aDouble = ((4.294967296E9 * ahi) + $uD((alo >>> 0)));
      var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
      var rDouble = (aDouble / bDouble);
      var x = (rDouble / 4.294967296E9);
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = $uI((x | 0));
      return $uI((rDouble | 0))
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    }
  } else if (((bhi === 0) && ((blo & (((-1) + blo) | 0)) === 0))) {
    var pow = ((31 - $clz32(blo)) | 0);
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((ahi >>> pow) | 0);
    return (((alo >>> pow) | 0) | ((ahi << 1) << ((31 - pow) | 0)))
  } else if (((blo === 0) && ((bhi & (((-1) + bhi) | 0)) === 0))) {
    var pow$2 = ((31 - $clz32(bhi)) | 0);
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
    return ((ahi >>> pow$2) | 0)
  } else {
    return $uI(this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(alo, ahi, blo, bhi, 0))
  }
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$toString__I__I__T = (function(lo, hi) {
  return ((hi === (lo >> 31)) ? ("" + lo) : ((hi < 0) ? ("-" + this.toUnsignedString__p1__I__I__T(((-lo) | 0), ((lo !== 0) ? (~hi) : ((-hi) | 0)))) : this.toUnsignedString__p1__I__I__T(lo, hi)))
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo === blo) ? 0 : ((((-2147483648) ^ alo) < ((-2147483648) ^ blo)) ? (-1) : 1)) : ((ahi < bhi) ? (-1) : 1))
});
$c_sjsr_RuntimeLong$.prototype.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar = (function(alo, ahi, blo, bhi, ask) {
  var shift = ((((bhi !== 0) ? $clz32(bhi) : ((32 + $clz32(blo)) | 0)) - ((ahi !== 0) ? $clz32(ahi) : ((32 + $clz32(alo)) | 0))) | 0);
  var n = shift;
  var lo = (((32 & n) === 0) ? (blo << n) : 0);
  var hi = (((32 & n) === 0) ? (((((blo >>> 1) | 0) >>> ((31 - n) | 0)) | 0) | (bhi << n)) : (blo << n));
  var bShiftLo = lo;
  var bShiftHi = hi;
  var remLo = alo;
  var remHi = ahi;
  var quotLo = 0;
  var quotHi = 0;
  while (((shift >= 0) && (((-2097152) & remHi) !== 0))) {
    var alo$1 = remLo;
    var ahi$1 = remHi;
    var blo$1 = bShiftLo;
    var bhi$1 = bShiftHi;
    if (((ahi$1 === bhi$1) ? (((-2147483648) ^ alo$1) >= ((-2147483648) ^ blo$1)) : (((-2147483648) ^ ahi$1) >= ((-2147483648) ^ bhi$1)))) {
      var lo$1 = remLo;
      var hi$1 = remHi;
      var lo$2 = bShiftLo;
      var hi$2 = bShiftHi;
      var lo$3 = ((lo$1 - lo$2) | 0);
      var hi$3 = ((((-2147483648) ^ lo$3) > ((-2147483648) ^ lo$1)) ? (((-1) + ((hi$1 - hi$2) | 0)) | 0) : ((hi$1 - hi$2) | 0));
      remLo = lo$3;
      remHi = hi$3;
      if ((shift < 32)) {
        quotLo = (quotLo | (1 << shift))
      } else {
        quotHi = (quotHi | (1 << shift))
      }
    };
    shift = (((-1) + shift) | 0);
    var lo$4 = bShiftLo;
    var hi$4 = bShiftHi;
    var lo$5 = (((lo$4 >>> 1) | 0) | (hi$4 << 31));
    var hi$5 = ((hi$4 >>> 1) | 0);
    bShiftLo = lo$5;
    bShiftHi = hi$5
  };
  var alo$2 = remLo;
  var ahi$2 = remHi;
  if (((ahi$2 === bhi) ? (((-2147483648) ^ alo$2) >= ((-2147483648) ^ blo)) : (((-2147483648) ^ ahi$2) >= ((-2147483648) ^ bhi)))) {
    var lo$6 = remLo;
    var hi$6 = remHi;
    var remDouble = ((4.294967296E9 * hi$6) + $uD((lo$6 >>> 0)));
    var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
    if ((ask !== 1)) {
      var x = (remDouble / bDouble);
      var lo$7 = $uI((x | 0));
      var x$1 = (x / 4.294967296E9);
      var hi$7 = $uI((x$1 | 0));
      var lo$8 = quotLo;
      var hi$8 = quotHi;
      var lo$9 = ((lo$8 + lo$7) | 0);
      var hi$9 = ((((-2147483648) ^ lo$9) < ((-2147483648) ^ lo$8)) ? ((1 + ((hi$8 + hi$7) | 0)) | 0) : ((hi$8 + hi$7) | 0));
      quotLo = lo$9;
      quotHi = hi$9
    };
    if ((ask !== 0)) {
      var rem_mod_bDouble = (remDouble % bDouble);
      remLo = $uI((rem_mod_bDouble | 0));
      var x$2 = (rem_mod_bDouble / 4.294967296E9);
      remHi = $uI((x$2 | 0))
    }
  };
  if ((ask === 0)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = quotHi;
    var a = quotLo;
    return a
  } else if ((ask === 1)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = remHi;
    var a$1 = remLo;
    return a$1
  } else {
    var lo$10 = quotLo;
    var hi$10 = quotHi;
    var quot = ((4.294967296E9 * hi$10) + $uD((lo$10 >>> 0)));
    var this$25 = remLo;
    var remStr = ("" + this$25);
    var a$2 = ((("" + quot) + $as_T("000000000".substring($uI(remStr.length)))) + remStr);
    return a$2
  }
});
$c_sjsr_RuntimeLong$.prototype.remainderImpl__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if (((blo | bhi) === 0)) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  };
  if ((ahi === (alo >> 31))) {
    if ((bhi === (blo >> 31))) {
      if ((blo !== (-1))) {
        var lo = ((alo % blo) | 0);
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (lo >> 31);
        return lo
      } else {
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
        return 0
      }
    } else if (((alo === (-2147483648)) && ((blo === (-2147483648)) && (bhi === 0)))) {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ahi;
      return alo
    }
  } else {
    var neg = (ahi < 0);
    if (neg) {
      var lo$1 = ((-alo) | 0);
      var hi = ((alo !== 0) ? (~ahi) : ((-ahi) | 0));
      var abs_$_lo$2 = lo$1;
      var abs_$_hi$2 = hi
    } else {
      var abs_$_lo$2 = alo;
      var abs_$_hi$2 = ahi
    };
    var neg$1 = (bhi < 0);
    if (neg$1) {
      var lo$2 = ((-blo) | 0);
      var hi$1 = ((blo !== 0) ? (~bhi) : ((-bhi) | 0));
      var abs$1_$_lo$2 = lo$2;
      var abs$1_$_hi$2 = hi$1
    } else {
      var abs$1_$_lo$2 = blo;
      var abs$1_$_hi$2 = bhi
    };
    var absRLo = this.unsigned$und$percent__p1__I__I__I__I__I(abs_$_lo$2, abs_$_hi$2, abs$1_$_lo$2, abs$1_$_hi$2);
    if (neg) {
      var hi$2 = this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((absRLo !== 0) ? (~hi$2) : ((-hi$2) | 0));
      return ((-absRLo) | 0)
    } else {
      return absRLo
    }
  }
});
$c_sjsr_RuntimeLong$.prototype.unsigned$und$percent__p1__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if ((((-2097152) & ahi) === 0)) {
    if ((((-2097152) & bhi) === 0)) {
      var aDouble = ((4.294967296E9 * ahi) + $uD((alo >>> 0)));
      var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
      var rDouble = (aDouble % bDouble);
      var x = (rDouble / 4.294967296E9);
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = $uI((x | 0));
      return $uI((rDouble | 0))
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ahi;
      return alo
    }
  } else if (((bhi === 0) && ((blo & (((-1) + blo) | 0)) === 0))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
    return (alo & (((-1) + blo) | 0))
  } else if (((blo === 0) && ((bhi & (((-1) + bhi) | 0)) === 0))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (ahi & (((-1) + bhi) | 0));
    return alo
  } else {
    return $uI(this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(alo, ahi, blo, bhi, 1))
  }
});
var $d_sjsr_RuntimeLong$ = new $TypeData().initClass({
  sjsr_RuntimeLong$: 0
}, false, "scala.scalajs.runtime.RuntimeLong$", {
  sjsr_RuntimeLong$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sjsr_RuntimeLong$.prototype.$classData = $d_sjsr_RuntimeLong$;
var $n_sjsr_RuntimeLong$ = (void 0);
function $m_sjsr_RuntimeLong$() {
  if ((!$n_sjsr_RuntimeLong$)) {
    $n_sjsr_RuntimeLong$ = new $c_sjsr_RuntimeLong$().init___()
  };
  return $n_sjsr_RuntimeLong$
}
function $is_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.Js$UnmountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.Js$UnmountedWithRoot;", depth))
}
function $is_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.JsFn$UnmountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.JsFn$UnmountedWithRoot;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$() {
  $c_O.call(this);
  this.backgroundAttachment$module$1 = null;
  this.backgroundOrigin$module$1 = null;
  this.backgroundClip$module$1 = null;
  this.backgroundSize$module$1 = null;
  this.borderCollapse$module$1 = null;
  this.borderSpacing$module$1 = null;
  this.boxSizing$module$1 = null;
  this.color$module$1 = null;
  this.clip$module$1 = null;
  this.cursor$module$1 = null;
  this.float$module$1 = null;
  this.direction$module$1 = null;
  this.display$module$1 = null;
  this.pointerEvents$module$1 = null;
  this.listStyleImage$module$1 = null;
  this.listStylePosition$module$1 = null;
  this.wordWrap$module$1 = null;
  this.overflowWrap$module$1 = null;
  this.verticalAlign$module$1 = null;
  this.mask$module$1 = null;
  this.emptyCells$module$1 = null;
  this.listStyleType$module$1 = null;
  this.captionSide$module$1 = null;
  this.position$module$1 = null;
  this.quotes$module$1 = null;
  this.tableLayout$module$1 = null;
  this.fontSize$module$1 = null;
  this.fontWeight$module$1 = null;
  this.fontStyle$module$1 = null;
  this.clear$module$1 = null;
  this.outlineWidth$module$1 = null;
  this.outlineColor$module$1 = null;
  this.textDecoration$module$1 = null;
  this.textOverflow$module$1 = null;
  this.textUnderlinePosition$module$1 = null;
  this.textTransform$module$1 = null;
  this.visibility$module$1 = null;
  this.whiteSpace$module$1 = null;
  this.backfaceVisibility$module$1 = null;
  this.columns$module$1 = null;
  this.columnFill$module$1 = null;
  this.columnSpan$module$1 = null;
  this.columnRuleWidth$module$1 = null;
  this.columnRuleStyle$module$1 = null;
  this.alignContent$module$1 = null;
  this.alignSelf$module$1 = null;
  this.flexWrap$module$1 = null;
  this.alignItems$module$1 = null;
  this.justifyContent$module$1 = null;
  this.flexDirection$module$1 = null;
  this.transformStyle$module$1 = null;
  this.unicodeBidi$module$1 = null;
  this.wordBreak$module$1 = null;
  this.justifySelf$module$1 = null;
  this.justifyItems$module$1 = null;
  this.aria$module$1 = null;
  this.autoComplete$module$1 = null;
  this.key$1 = null;
  this.onChange$1 = null;
  this.onClick$1 = null;
  this.onClickCapture$1 = null;
  this.src$1 = null;
  this.target$module$1 = null;
  this.title$1 = null;
  this.type$1 = null;
  this.value$1 = null;
  this.wrap$module$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype = $c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype;
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype.init___ = (function() {
  $n_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$ = this;
  $f_Ljapgolly_scalajs_react_vdom_HtmlAttrs__$$init$__V(this);
  return this
});
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype.position$lzycompute$1__p1__V = (function() {
  if (($m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$().position$module$1 === null)) {
    $m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$().position$module$1 = new $c_Ljapgolly_scalajs_react_vdom_HtmlStyles$position$().init___Ljapgolly_scalajs_react_vdom_HtmlStyles(this)
  }
});
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype.position__Ljapgolly_scalajs_react_vdom_HtmlStyles$position$ = (function() {
  if (($m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$().position$module$1 === null)) {
    this.position$lzycompute$1__p1__V()
  };
  return $m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$().position$module$1
});
var $d_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$: 0
}, false, "japgolly.scalajs.react.vdom.HtmlAttrAndStyles$", {
  Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles: 1,
  Ljapgolly_scalajs_react_vdom_HtmlAttrs: 1,
  Ljapgolly_scalajs_react_vdom_HtmlStyles: 1
});
$c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$;
var $n_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$)) {
    $n_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$ = new $c_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$
}
function $is_Ljava_io_IOException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_IOException)))
}
function $as_Ljava_io_IOException(obj) {
  return (($is_Ljava_io_IOException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.IOException"))
}
function $isArrayOf_Ljava_io_IOException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_IOException)))
}
function $asArrayOf_Ljava_io_IOException(obj, depth) {
  return (($isArrayOf_Ljava_io_IOException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.IOException;", depth))
}
/** @constructor */
function $c_Ljava_io_OutputStream() {
  $c_O.call(this)
}
$c_Ljava_io_OutputStream.prototype = new $h_O();
$c_Ljava_io_OutputStream.prototype.constructor = $c_Ljava_io_OutputStream;
/** @constructor */
function $h_Ljava_io_OutputStream() {
  /*<skip>*/
}
$h_Ljava_io_OutputStream.prototype = $c_Ljava_io_OutputStream.prototype;
$c_Ljava_io_OutputStream.prototype.close__V = (function() {
  /*<skip>*/
});
function $is_T(obj) {
  return ((typeof obj) === "string")
}
function $as_T(obj) {
  return (($is_T(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.String"))
}
function $isArrayOf_T(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T)))
}
function $asArrayOf_T(obj, depth) {
  return (($isArrayOf_T(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.String;", depth))
}
var $d_T = new $TypeData().initClass({
  T: 0
}, false, "java.lang.String", {
  T: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_CharSequence: 1,
  jl_Comparable: 1
}, (void 0), (void 0), $is_T);
/** @constructor */
function $c_jl_AssertionError() {
  $c_jl_Error.call(this)
}
$c_jl_AssertionError.prototype = new $h_jl_Error();
$c_jl_AssertionError.prototype.constructor = $c_jl_AssertionError;
/** @constructor */
function $h_jl_AssertionError() {
  /*<skip>*/
}
$h_jl_AssertionError.prototype = $c_jl_AssertionError.prototype;
$c_jl_AssertionError.prototype.init___O = (function(detailMessage) {
  var message = ("" + detailMessage);
  if ($is_jl_Throwable(detailMessage)) {
    var x2 = $as_jl_Throwable(detailMessage);
    var cause = x2
  } else {
    var cause = null
  };
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, message, cause);
  return this
});
var $d_jl_AssertionError = new $TypeData().initClass({
  jl_AssertionError: 0
}, false, "java.lang.AssertionError", {
  jl_AssertionError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_AssertionError.prototype.$classData = $d_jl_AssertionError;
var $d_jl_Byte = new $TypeData().initClass({
  jl_Byte: 0
}, false, "java.lang.Byte", {
  jl_Byte: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isByte(x)
}));
/** @constructor */
function $c_jl_CloneNotSupportedException() {
  $c_jl_Exception.call(this)
}
$c_jl_CloneNotSupportedException.prototype = new $h_jl_Exception();
$c_jl_CloneNotSupportedException.prototype.constructor = $c_jl_CloneNotSupportedException;
/** @constructor */
function $h_jl_CloneNotSupportedException() {
  /*<skip>*/
}
$h_jl_CloneNotSupportedException.prototype = $c_jl_CloneNotSupportedException.prototype;
$c_jl_CloneNotSupportedException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_jl_CloneNotSupportedException = new $TypeData().initClass({
  jl_CloneNotSupportedException: 0
}, false, "java.lang.CloneNotSupportedException", {
  jl_CloneNotSupportedException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_CloneNotSupportedException.prototype.$classData = $d_jl_CloneNotSupportedException;
function $isArrayOf_jl_Double(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Double)))
}
function $asArrayOf_jl_Double(obj, depth) {
  return (($isArrayOf_jl_Double(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Double;", depth))
}
var $d_jl_Double = new $TypeData().initClass({
  jl_Double: 0
}, false, "java.lang.Double", {
  jl_Double: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "number")
}));
var $d_jl_Float = new $TypeData().initClass({
  jl_Float: 0
}, false, "java.lang.Float", {
  jl_Float: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isFloat(x)
}));
function $isArrayOf_jl_Integer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Integer)))
}
function $asArrayOf_jl_Integer(obj, depth) {
  return (($isArrayOf_jl_Integer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Integer;", depth))
}
var $d_jl_Integer = new $TypeData().initClass({
  jl_Integer: 0
}, false, "java.lang.Integer", {
  jl_Integer: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isInt(x)
}));
function $is_jl_InterruptedException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_InterruptedException)))
}
function $as_jl_InterruptedException(obj) {
  return (($is_jl_InterruptedException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.InterruptedException"))
}
function $isArrayOf_jl_InterruptedException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_InterruptedException)))
}
function $asArrayOf_jl_InterruptedException(obj, depth) {
  return (($isArrayOf_jl_InterruptedException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.InterruptedException;", depth))
}
function $is_jl_LinkageError(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_LinkageError)))
}
function $as_jl_LinkageError(obj) {
  return (($is_jl_LinkageError(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.LinkageError"))
}
function $isArrayOf_jl_LinkageError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_LinkageError)))
}
function $asArrayOf_jl_LinkageError(obj, depth) {
  return (($isArrayOf_jl_LinkageError(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.LinkageError;", depth))
}
function $isArrayOf_jl_Long(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Long)))
}
function $asArrayOf_jl_Long(obj, depth) {
  return (($isArrayOf_jl_Long(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Long;", depth))
}
var $d_jl_Long = new $TypeData().initClass({
  jl_Long: 0
}, false, "java.lang.Long", {
  jl_Long: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $is_sjsr_RuntimeLong(x)
}));
/** @constructor */
function $c_jl_RuntimeException() {
  $c_jl_Exception.call(this)
}
$c_jl_RuntimeException.prototype = new $h_jl_Exception();
$c_jl_RuntimeException.prototype.constructor = $c_jl_RuntimeException;
/** @constructor */
function $h_jl_RuntimeException() {
  /*<skip>*/
}
$h_jl_RuntimeException.prototype = $c_jl_RuntimeException.prototype;
var $d_jl_Short = new $TypeData().initClass({
  jl_Short: 0
}, false, "java.lang.Short", {
  jl_Short: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isShort(x)
}));
/** @constructor */
function $c_jl_StringBuffer() {
  $c_O.call(this);
  this.builder$1 = null
}
$c_jl_StringBuffer.prototype = new $h_O();
$c_jl_StringBuffer.prototype.constructor = $c_jl_StringBuffer;
/** @constructor */
function $h_jl_StringBuffer() {
  /*<skip>*/
}
$h_jl_StringBuffer.prototype = $c_jl_StringBuffer.prototype;
$c_jl_StringBuffer.prototype.init___ = (function() {
  $c_jl_StringBuffer.prototype.init___jl_StringBuilder.call(this, new $c_jl_StringBuilder().init___());
  return this
});
$c_jl_StringBuffer.prototype.append__jl_CharSequence__jl_StringBuffer = (function(s) {
  var this$1 = this.builder$1;
  this$1.java$lang$StringBuilder$$content$f = (("" + this$1.java$lang$StringBuilder$$content$f) + s);
  return this
});
$c_jl_StringBuffer.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var this$1 = this.builder$1;
  return this$1.substring__I__I__T(start, end)
});
$c_jl_StringBuffer.prototype.toString__T = (function() {
  return this.builder$1.java$lang$StringBuilder$$content$f
});
$c_jl_StringBuffer.prototype.append__jl_CharSequence__jl_Appendable = (function(csq) {
  return this.append__jl_CharSequence__jl_StringBuffer(csq)
});
$c_jl_StringBuffer.prototype.append__T__jl_StringBuffer = (function(str) {
  var this$1 = this.builder$1;
  this$1.java$lang$StringBuilder$$content$f = (("" + this$1.java$lang$StringBuilder$$content$f) + str);
  return this
});
$c_jl_StringBuffer.prototype.init___jl_StringBuilder = (function(builder) {
  this.builder$1 = builder;
  return this
});
$c_jl_StringBuffer.prototype.append__C__jl_StringBuffer = (function(c) {
  this.builder$1.append__C__jl_StringBuilder(c);
  return this
});
var $d_jl_StringBuffer = new $TypeData().initClass({
  jl_StringBuffer: 0
}, false, "java.lang.StringBuffer", {
  jl_StringBuffer: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuffer.prototype.$classData = $d_jl_StringBuffer;
/** @constructor */
function $c_jl_StringBuilder() {
  $c_O.call(this);
  this.java$lang$StringBuilder$$content$f = null
}
$c_jl_StringBuilder.prototype = new $h_O();
$c_jl_StringBuilder.prototype.constructor = $c_jl_StringBuilder;
/** @constructor */
function $h_jl_StringBuilder() {
  /*<skip>*/
}
$h_jl_StringBuilder.prototype = $c_jl_StringBuilder.prototype;
$c_jl_StringBuilder.prototype.init___ = (function() {
  this.java$lang$StringBuilder$$content$f = "";
  return this
});
$c_jl_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  return this.substring__I__I__T(start, end)
});
$c_jl_StringBuilder.prototype.toString__T = (function() {
  return this.java$lang$StringBuilder$$content$f
});
$c_jl_StringBuilder.prototype.append__jl_CharSequence__jl_Appendable = (function(csq) {
  this.java$lang$StringBuilder$$content$f = (("" + this.java$lang$StringBuilder$$content$f) + csq);
  return this
});
$c_jl_StringBuilder.prototype.init___I = (function(initialCapacity) {
  $c_jl_StringBuilder.prototype.init___.call(this);
  if ((initialCapacity < 0)) {
    throw new $c_jl_NegativeArraySizeException().init___()
  };
  return this
});
$c_jl_StringBuilder.prototype.length__I = (function() {
  var thiz = this.java$lang$StringBuilder$$content$f;
  return $uI(thiz.length)
});
$c_jl_StringBuilder.prototype.substring__I__I__T = (function(start, end) {
  var thiz = this.java$lang$StringBuilder$$content$f;
  return $as_T(thiz.substring(start, end))
});
$c_jl_StringBuilder.prototype.append__C__jl_StringBuilder = (function(c) {
  var str = $as_T($g.String.fromCharCode(c));
  this.java$lang$StringBuilder$$content$f = (("" + this.java$lang$StringBuilder$$content$f) + str);
  return this
});
$c_jl_StringBuilder.prototype.charAt__I__C = (function(index) {
  var thiz = this.java$lang$StringBuilder$$content$f;
  return (65535 & $uI(thiz.charCodeAt(index)))
});
var $d_jl_StringBuilder = new $TypeData().initClass({
  jl_StringBuilder: 0
}, false, "java.lang.StringBuilder", {
  jl_StringBuilder: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuilder.prototype.$classData = $d_jl_StringBuilder;
function $is_jl_ThreadDeath(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_ThreadDeath)))
}
function $as_jl_ThreadDeath(obj) {
  return (($is_jl_ThreadDeath(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.ThreadDeath"))
}
function $isArrayOf_jl_ThreadDeath(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_ThreadDeath)))
}
function $asArrayOf_jl_ThreadDeath(obj, depth) {
  return (($isArrayOf_jl_ThreadDeath(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.ThreadDeath;", depth))
}
function $is_jl_VirtualMachineError(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_VirtualMachineError)))
}
function $as_jl_VirtualMachineError(obj) {
  return (($is_jl_VirtualMachineError(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.VirtualMachineError"))
}
function $isArrayOf_jl_VirtualMachineError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_VirtualMachineError)))
}
function $asArrayOf_jl_VirtualMachineError(obj, depth) {
  return (($isArrayOf_jl_VirtualMachineError(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.VirtualMachineError;", depth))
}
/** @constructor */
function $c_ju_Formatter() {
  $c_O.call(this);
  this.dest$1 = null;
  this.stringOutput$1 = null;
  this.java$util$Formatter$$closed$f = false;
  this.java$util$Formatter$$lastIOException$f = null
}
$c_ju_Formatter.prototype = new $h_O();
$c_ju_Formatter.prototype.constructor = $c_ju_Formatter;
/** @constructor */
function $h_ju_Formatter() {
  /*<skip>*/
}
$h_ju_Formatter.prototype = $c_ju_Formatter.prototype;
$c_ju_Formatter.prototype.init___ = (function() {
  $c_ju_Formatter.prototype.init___jl_Appendable.call(this, null);
  return this
});
$c_ju_Formatter.prototype.sendToDest__p1__T__T__V = (function(s1, s2) {
  if ((this.dest$1 === null)) {
    this.stringOutput$1 = ((("" + this.stringOutput$1) + s1) + s2)
  } else {
    this.sendToDestSlowPath__p1__sjs_js_Array__V([s1, s2])
  }
});
$c_ju_Formatter.prototype.computerizedScientificNotation__p1__D__I__Z__T = (function(x, precision, forceDecimalSep) {
  var s1 = $as_T(x.toExponential(precision));
  var s2 = (((x === 0.0) && ((1 / x) < 0)) ? ("-" + s1) : s1);
  var len = $uI(s2.length);
  var index = (((-3) + len) | 0);
  if (((65535 & $uI(s2.charCodeAt(index))) !== 101)) {
    var s3 = s2
  } else {
    var endIndex = (((-1) + len) | 0);
    var jsx$1 = $as_T(s2.substring(0, endIndex));
    var beginIndex = (((-1) + len) | 0);
    var s3 = ((jsx$1 + "0") + $as_T(s2.substring(beginIndex)))
  };
  if (((!forceDecimalSep) || ($uI(s3.indexOf(".")) >= 0))) {
    return s3
  } else {
    var pos = $uI(s3.indexOf("e"));
    return (($as_T(s3.substring(0, pos)) + ".") + $as_T(s3.substring(pos)))
  }
});
$c_ju_Formatter.prototype.strRepeat__p1__T__I__T = (function(s, times) {
  var result = "";
  var i = 0;
  while ((i !== times)) {
    result = (("" + result) + s);
    i = ((1 + i) | 0)
  };
  return result
});
$c_ju_Formatter.prototype.padAndSendToDestNoZeroPad__p1__I__I__T__V = (function(flags, width, str) {
  var len = $uI(str.length);
  if ((len >= width)) {
    this.sendToDest__p1__T__V(str)
  } else if (((1 & flags) !== 0)) {
    this.sendToDest__p1__T__T__V(str, this.strRepeat__p1__T__I__T(" ", ((width - len) | 0)))
  } else {
    this.sendToDest__p1__T__T__V(this.strRepeat__p1__T__I__T(" ", ((width - len) | 0)), str)
  }
});
$c_ju_Formatter.prototype.applyUpperCase__p1__I__T__T = (function(flags, str) {
  return (((256 & flags) !== 0) ? $as_T(str.toUpperCase()) : str)
});
$c_ju_Formatter.prototype.insertGroupingSeps__p1__T__T = (function(s) {
  var len = $uI(s.length);
  var index = 0;
  while (true) {
    if ((index !== len)) {
      var index$1 = index;
      var c = (65535 & $uI(s.charCodeAt(index$1)));
      var jsx$1 = ((c >= 48) && (c <= 57))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      index = ((1 + index) | 0)
    } else {
      break
    }
  };
  index = (((-3) + index) | 0);
  if ((index <= 0)) {
    return s
  } else {
    var beginIndex = index;
    var result = $as_T(s.substring(beginIndex));
    while ((index > 3)) {
      var next = (((-3) + index) | 0);
      var endIndex = index;
      result = (($as_T(s.substring(next, endIndex)) + ",") + result);
      index = next
    };
    var endIndex$1 = index;
    return (($as_T(s.substring(0, endIndex$1)) + ",") + result)
  }
});
$c_ju_Formatter.prototype.toString__T = (function() {
  if (this.java$util$Formatter$$closed$f) {
    throw new $c_ju_FormatterClosedException().init___()
  };
  return ((this.dest$1 === null) ? this.stringOutput$1 : this.dest$1.toString__T())
});
$c_ju_Formatter.prototype.flagsToString__p1__I__T = (function(flags) {
  return ((((((((((1 & flags) !== 0) ? "-" : "") + (((2 & flags) !== 0) ? "#" : "")) + (((4 & flags) !== 0) ? "+" : "")) + (((8 & flags) !== 0) ? " " : "")) + (((16 & flags) !== 0) ? "0" : "")) + (((32 & flags) !== 0) ? "," : "")) + (((64 & flags) !== 0) ? "(" : "")) + (((128 & flags) !== 0) ? "<" : ""))
});
$c_ju_Formatter.prototype.init___jl_Appendable = (function(dest) {
  this.dest$1 = dest;
  this.stringOutput$1 = "";
  this.java$util$Formatter$$closed$f = false;
  this.java$util$Formatter$$lastIOException$f = null;
  return this
});
$c_ju_Formatter.prototype.parsePositiveIntSilent__p1__sjs_js_UndefOr__I__I = (function(capture, $default) {
  if ((capture === (void 0))) {
    return $default
  } else {
    var s = $as_T(capture);
    var x = $uD($g.parseInt(s, 10));
    return ((x <= 2147483647) ? $doubleToInt(x) : (-1))
  }
});
$c_ju_Formatter.prototype.generalScientificNotation__p1__D__I__Z__T = (function(x, precision, forceDecimalSep) {
  var m = $uD($g.Math.abs(x));
  var p = ((precision === 0) ? 1 : precision);
  if (((m >= 1.0E-4) && (m < $uD($g.Math.pow(10.0, p))))) {
    var v = $g.Math.log10;
    if ((!(v === (void 0)))) {
      var a = $uD($g.Math.log10(m))
    } else {
      var a = ($uD($g.Math.log(m)) / 2.302585092994046)
    };
    var sig0 = $doubleToInt($uD($g.Math.ceil(a)));
    var sig = (($uD($g.Math.pow(10.0, sig0)) <= m) ? ((1 + sig0) | 0) : sig0);
    var a$1 = ((p - sig) | 0);
    return this.decimalNotation__p1__D__I__Z__T(x, ((a$1 > 0) ? a$1 : 0), forceDecimalSep)
  } else {
    return this.computerizedScientificNotation__p1__D__I__Z__T(x, (((-1) + p) | 0), forceDecimalSep)
  }
});
$c_ju_Formatter.prototype.formatArg__p1__O__C__I__I__I__V = (function(arg, conversion, flags, width, precision) {
  switch (conversion) {
    case 98:
    case 66: {
      if (((126 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 126)
      };
      var str = (((arg === false) || (arg === null)) ? "false" : "true");
      this.formatNonNumericString__p1__I__I__I__T__V(flags, width, precision, str);
      break
    }
    case 104:
    case 72: {
      if (((126 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 126)
      };
      if ((arg === null)) {
        var str$2 = "null"
      } else {
        var i = $objectHashCode(arg);
        var x = $uD((i >>> 0));
        var jsx$1 = x.toString(16);
        var str$2 = $as_T(jsx$1)
      };
      this.formatNonNumericString__p1__I__I__I__T__V(flags, width, precision, str$2);
      break
    }
    case 115:
    case 83: {
      if ($is_ju_Formattable(arg)) {
        var x2 = $as_ju_Formattable(arg);
        if (((124 & flags) !== 0)) {
          this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 124)
        };
        var formattableFlags = (((((1 & flags) !== 0) ? 1 : 0) | (((2 & flags) !== 0) ? 4 : 0)) | (((256 & flags) !== 0) ? 2 : 0));
        x2.formatTo__ju_Formatter__I__I__I__V(this, formattableFlags, width, precision)
      } else {
        if (((126 & flags) !== 0)) {
          this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 126)
        };
        var str$3 = ("" + arg);
        this.formatNonNumericString__p1__I__I__I__T__V(flags, width, precision, str$3)
      };
      break
    }
    case 99:
    case 67: {
      if (((126 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 126)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      if ($is_jl_Character(arg)) {
        if ((arg === null)) {
          var x2$2 = 0
        } else {
          var this$10 = $as_jl_Character(arg);
          var x2$2 = this$10.value$1
        };
        this.formatNonNumericString__p1__I__I__I__T__V(flags, width, (-1), $as_T($g.String.fromCharCode(x2$2)))
      } else if ($isInt(arg)) {
        var x3 = $uI(arg);
        if ((!((x3 >= 0) && (x3 <= 1114111)))) {
          throw new $c_ju_IllegalFormatCodePointException().init___I(x3)
        };
        if ((x3 < 65536)) {
          var str$4 = $g.String.fromCharCode(x3)
        } else {
          var jsx$2 = $g.String;
          var value = (55296 | (((-64) + (x3 >> 10)) | 0));
          var value$1 = (56320 | (1023 & x3));
          var str$4 = jsx$2.fromCharCode(value, value$1)
        };
        this.formatNonNumericString__p1__I__I__I__T__V(flags, width, (-1), $as_T(str$4))
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 100: {
      if (((2 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 2)
      };
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      if ($isInt(arg)) {
        var x2$3 = $uI(arg);
        this.java$util$Formatter$$formatNumericString__I__I__T__V(flags, width, ("" + x2$3))
      } else if ($is_sjsr_RuntimeLong(arg)) {
        var t = $uJ(arg);
        var lo = t.lo$2;
        var hi = t.hi$2;
        this.java$util$Formatter$$formatNumericString__I__I__T__V(flags, width, $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toString__I__I__T(lo, hi))
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 111: {
      if (((108 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 108)
      };
      if (((17 & flags) === 17)) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      var prefix = (((2 & flags) !== 0) ? "0" : "");
      if ($isInt(arg)) {
        var x2$4 = $uI(arg);
        var x$1 = $uD((x2$4 >>> 0));
        var jsx$3 = x$1.toString(8);
        this.padAndSendToDest__p1__I__I__T__T__V(flags, width, prefix, $as_T(jsx$3))
      } else if ($is_sjsr_RuntimeLong(arg)) {
        var t$1 = $uJ(arg);
        var lo$1 = t$1.lo$2;
        var hi$1 = t$1.hi$2;
        var this$31 = $m_jl_Long$();
        this.padAndSendToDest__p1__I__I__T__T__V(flags, width, prefix, this$31.java$lang$Long$$toOctalString__I__I__T(lo$1, hi$1))
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 120:
    case 88: {
      if (((108 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 108)
      };
      if (((17 & flags) === 17)) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      var prefix$2 = (((2 & flags) === 0) ? "" : (((256 & flags) !== 0) ? "0X" : "0x"));
      if ($isInt(arg)) {
        var x2$5 = $uI(arg);
        var x$2 = $uD((x2$5 >>> 0));
        var jsx$4 = x$2.toString(16);
        this.padAndSendToDest__p1__I__I__T__T__V(flags, width, prefix$2, this.applyUpperCase__p1__I__T__T(flags, $as_T(jsx$4)))
      } else if ($is_sjsr_RuntimeLong(arg)) {
        var t$2 = $uJ(arg);
        var lo$2 = t$2.lo$2;
        var hi$2 = t$2.hi$2;
        var this$38 = $m_jl_Long$();
        this.padAndSendToDest__p1__I__I__T__T__V(flags, width, prefix$2, this.applyUpperCase__p1__I__T__T(flags, this$38.java$lang$Long$$toHexString__I__I__T(lo$2, hi$2)))
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 101:
    case 69: {
      if (((32 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 32)
      };
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if (((typeof arg) === "number")) {
        var x2$1 = $uD(arg);
        if (((x2$1 !== x2$1) || ((x2$1 === Infinity) || (x2$1 === (-Infinity))))) {
          this.java$util$Formatter$$formatNaNOrInfinite__I__I__D__V(flags, width, x2$1)
        } else {
          var forceDecimalSep = ((2 & flags) !== 0);
          var arg2 = ((precision >= 0) ? precision : 6);
          this.java$util$Formatter$$formatNumericString__I__I__T__V(flags, width, this.computerizedScientificNotation__p1__D__I__Z__T(x2$1, arg2, forceDecimalSep))
        }
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 103:
    case 71: {
      if (((2 & flags) !== 0)) {
        this.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$(flags, conversion, 2)
      };
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if (((typeof arg) === "number")) {
        var x2$6 = $uD(arg);
        if (((x2$6 !== x2$6) || ((x2$6 === Infinity) || (x2$6 === (-Infinity))))) {
          this.java$util$Formatter$$formatNaNOrInfinite__I__I__D__V(flags, width, x2$6)
        } else {
          var forceDecimalSep$1 = ((2 & flags) !== 0);
          var arg2$1 = ((precision >= 0) ? precision : 6);
          this.java$util$Formatter$$formatNumericString__I__I__T__V(flags, width, this.generalScientificNotation__p1__D__I__Z__T(x2$6, arg2$1, forceDecimalSep$1))
        }
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 102: {
      if ((((17 & flags) === 17) || ((12 & flags) === 12))) {
        this.illegalFlags$1__p1__I__sr_Nothing$(flags)
      };
      if (((typeof arg) === "number")) {
        var x2$7 = $uD(arg);
        if (((x2$7 !== x2$7) || ((x2$7 === Infinity) || (x2$7 === (-Infinity))))) {
          this.java$util$Formatter$$formatNaNOrInfinite__I__I__D__V(flags, width, x2$7)
        } else {
          var forceDecimalSep$2 = ((2 & flags) !== 0);
          var arg2$2 = ((precision >= 0) ? precision : 6);
          this.java$util$Formatter$$formatNumericString__I__I__T__V(flags, width, this.decimalNotation__p1__D__I__Z__T(x2$7, arg2$2, forceDecimalSep$2))
        }
      } else {
        this.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V(arg, conversion, flags, width, precision)
      };
      break
    }
    case 37: {
      if (((254 & flags) !== 0)) {
        this.illegalFlags$2__p1__I__sr_Nothing$(flags)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      if ((((1 & flags) !== 0) && (width < 0))) {
        throw new $c_ju_MissingFormatWidthException().init___T("%-%")
      };
      this.padAndSendToDestNoZeroPad__p1__I__I__T__V(flags, width, "%");
      break
    }
    case 110: {
      if (((255 & flags) !== 0)) {
        this.illegalFlags$2__p1__I__sr_Nothing$(flags)
      };
      if ((precision >= 0)) {
        throw new $c_ju_IllegalFormatPrecisionException().init___I(precision)
      };
      if ((width >= 0)) {
        throw new $c_ju_IllegalFormatWidthException().init___I(width)
      };
      this.sendToDest__p1__T__V("\n");
      break
    }
    default: {
      throw new $c_ju_UnknownFormatConversionException().init___T($as_T($g.String.fromCharCode(conversion)))
    }
  }
});
$c_ju_Formatter.prototype.sendToDest__p1__T__T__T__V = (function(s1, s2, s3) {
  if ((this.dest$1 === null)) {
    this.stringOutput$1 = ((this.stringOutput$1 + (("" + s1) + s2)) + s3)
  } else {
    this.sendToDestSlowPath__p1__sjs_js_Array__V([s1, s2, s3])
  }
});
$c_ju_Formatter.prototype.padAndSendToDest__p1__I__I__T__T__V = (function(flags, width, prefix, str) {
  var len = (($uI(prefix.length) + $uI(str.length)) | 0);
  if ((len >= width)) {
    this.sendToDest__p1__T__T__V(prefix, str)
  } else if (((16 & flags) !== 0)) {
    this.sendToDest__p1__T__T__T__V(prefix, this.strRepeat__p1__T__I__T("0", ((width - len) | 0)), str)
  } else if (((1 & flags) !== 0)) {
    this.sendToDest__p1__T__T__T__V(prefix, str, this.strRepeat__p1__T__I__T(" ", ((width - len) | 0)))
  } else {
    this.sendToDest__p1__T__T__T__V(this.strRepeat__p1__T__I__T(" ", ((width - len) | 0)), prefix, str)
  }
});
$c_ju_Formatter.prototype.java$util$Formatter$$formatNaNOrInfinite__I__I__D__V = (function(flags, width, x) {
  var str = ((x !== x) ? "NaN" : ((x > 0.0) ? (((4 & flags) !== 0) ? "+Infinity" : (((8 & flags) !== 0) ? " Infinity" : "Infinity")) : (((64 & flags) !== 0) ? "(Infinity)" : "-Infinity")));
  this.padAndSendToDestNoZeroPad__p1__I__I__T__V(flags, width, this.applyUpperCase__p1__I__T__T(flags, str))
});
$c_ju_Formatter.prototype.formatNullOrThrowIllegalFormatConversion$1__p1__O__C__I__I__I__V = (function(arg$1, conversion$1, flags$1, width$1, precision$1) {
  if ((arg$1 === null)) {
    this.formatNonNumericString__p1__I__I__I__T__V(flags$1, width$1, precision$1, "null")
  } else {
    throw new $c_ju_IllegalFormatConversionException().init___C__jl_Class(conversion$1, $objectGetClass(arg$1))
  }
});
$c_ju_Formatter.prototype.sendToDestSlowPath__p1__sjs_js_Array__V = (function(ss) {
  try {
    var i = 0;
    var len = $uI(ss.length);
    while ((i < len)) {
      var index = i;
      var arg1 = ss[index];
      var x$1 = $as_T(arg1);
      this.dest$1.append__jl_CharSequence__jl_Appendable(x$1);
      i = ((1 + i) | 0)
    }
  } catch (e) {
    if ($is_Ljava_io_IOException(e)) {
      var th = $as_Ljava_io_IOException(e);
      this.java$util$Formatter$$lastIOException$f = th
    } else {
      throw e
    }
  }
});
$c_ju_Formatter.prototype.format__T__AO__ju_Formatter = (function(format, args) {
  if (this.java$util$Formatter$$closed$f) {
    throw new $c_ju_FormatterClosedException().init___()
  };
  var lastImplicitArgIndex = 0;
  var lastArgIndex = 0;
  var fmtLength = $uI(format.length);
  var fmtIndex = 0;
  while ((fmtIndex !== fmtLength)) {
    var fromIndex = fmtIndex;
    var nextPercentIndex = $uI(format.indexOf("%", fromIndex));
    if ((nextPercentIndex < 0)) {
      var beginIndex = fmtIndex;
      this.sendToDest__p1__T__V($as_T(format.substring(beginIndex)));
      return this
    };
    var beginIndex$1 = fmtIndex;
    this.sendToDest__p1__T__V($as_T(format.substring(beginIndex$1, nextPercentIndex)));
    var formatSpecifierIndex = ((1 + nextPercentIndex) | 0);
    var re = $m_ju_Formatter$().java$util$Formatter$$FormatSpecifier$1;
    re.lastIndex = formatSpecifierIndex;
    var execResult = re.exec(format);
    if (((execResult === null) || ($uI(execResult.index) !== formatSpecifierIndex))) {
      if ((formatSpecifierIndex === fmtLength)) {
        var conversion = "%"
      } else {
        var endIndex = ((1 + formatSpecifierIndex) | 0);
        var conversion = $as_T(format.substring(formatSpecifierIndex, endIndex))
      };
      throw new $c_ju_UnknownFormatConversionException().init___T(conversion)
    };
    fmtIndex = $uI(re.lastIndex);
    var index = (((-1) + fmtIndex) | 0);
    var conversion$2 = (65535 & $uI(format.charCodeAt(index)));
    var flags = this.parseFlags__p1__T__C__I($as_T(execResult[2]), conversion$2);
    var width = this.parsePositiveIntSilent__p1__sjs_js_UndefOr__I__I(execResult[3], (-1));
    var precision = this.parsePositiveIntSilent__p1__sjs_js_UndefOr__I__I(execResult[4], (-1));
    if (((conversion$2 === 37) || (conversion$2 === 110))) {
      var arg = null
    } else {
      if ((((1 & flags) !== 0) && (width < 0))) {
        throw new $c_ju_MissingFormatWidthException().init___T(("%" + execResult[0]))
      };
      if (((128 & flags) !== 0)) {
        var argIndex = lastArgIndex
      } else {
        var i = this.parsePositiveIntSilent__p1__sjs_js_UndefOr__I__I(execResult[1], 0);
        if ((i === 0)) {
          lastImplicitArgIndex = ((1 + lastImplicitArgIndex) | 0);
          var argIndex = lastImplicitArgIndex
        } else {
          var argIndex = ((i < 0) ? lastArgIndex : i)
        }
      };
      if (((argIndex <= 0) || (argIndex > args.u.length))) {
        var conversionStr = $as_T($g.String.fromCharCode(conversion$2));
        if (($uI("bBhHsHcCdoxXeEgGfn%".indexOf(conversionStr)) < 0)) {
          throw new $c_ju_UnknownFormatConversionException().init___T(conversionStr)
        } else {
          throw new $c_ju_MissingFormatArgumentException().init___T(("%" + execResult[0]))
        }
      };
      lastArgIndex = argIndex;
      var arg = args.get((((-1) + argIndex) | 0))
    };
    this.formatArg__p1__O__C__I__I__I__V(arg, conversion$2, flags, width, precision)
  };
  return this
});
$c_ju_Formatter.prototype.decimalNotation__p1__D__I__Z__T = (function(x, precision, forceDecimalSep) {
  var s1 = $as_T(x.toFixed(precision));
  var s2 = (((x === 0.0) && ((1 / x) < 0)) ? ("-" + s1) : s1);
  return ((forceDecimalSep && ($uI(s2.indexOf(".")) < 0)) ? (s2 + ".") : s2)
});
$c_ju_Formatter.prototype.formatNonNumericString__p1__I__I__I__T__V = (function(flags, width, precision, str) {
  var truncatedStr = ((precision < 0) ? str : $as_T(str.substring(0, precision)));
  this.padAndSendToDestNoZeroPad__p1__I__I__T__V(flags, width, this.applyUpperCase__p1__I__T__T(flags, truncatedStr))
});
$c_ju_Formatter.prototype.illegalFlags$1__p1__I__sr_Nothing$ = (function(flags$2) {
  throw new $c_ju_IllegalFormatFlagsException().init___T(this.flagsToString__p1__I__T(flags$2))
});
$c_ju_Formatter.prototype.illegalFlags$2__p1__I__sr_Nothing$ = (function(flags$3) {
  throw new $c_ju_IllegalFormatFlagsException().init___T(this.flagsToString__p1__I__T(flags$3))
});
$c_ju_Formatter.prototype.sendToDest__p1__T__V = (function(s) {
  if ((this.dest$1 === null)) {
    this.stringOutput$1 = (("" + this.stringOutput$1) + s)
  } else {
    this.sendToDestSlowPath__p1__sjs_js_Array__V([s])
  }
});
$c_ju_Formatter.prototype.flagsConversionMismatch$1__p1__I__C__I__sr_Nothing$ = (function(flags$2, conversion$2, invalidFlags$1) {
  throw new $c_ju_FormatFlagsConversionMismatchException().init___T__C(this.flagsToString__p1__I__T((flags$2 & invalidFlags$1)), conversion$2)
});
$c_ju_Formatter.prototype.java$util$Formatter$$formatNumericString__I__I__T__V = (function(flags, width, str) {
  if ((($uI(str.length) >= width) && ((108 & flags) === 0))) {
    this.sendToDest__p1__T__V(this.applyUpperCase__p1__I__T__T(flags, str))
  } else if (((124 & flags) === 0)) {
    this.formatNonNumericString__p1__I__I__I__T__V(flags, width, (-1), str)
  } else {
    if (((65535 & $uI(str.charCodeAt(0))) !== 45)) {
      if (((4 & flags) !== 0)) {
        var x1_$_$$und1$f = "+";
        var x1_$_$$und2$f = str
      } else if (((8 & flags) !== 0)) {
        var x1_$_$$und1$f = " ";
        var x1_$_$$und2$f = str
      } else {
        var x1_$_$$und1$f = "";
        var x1_$_$$und2$f = str
      }
    } else if (((64 & flags) !== 0)) {
      var _2 = ($as_T(str.substring(1)) + ")");
      var x1_$_$$und1$f = "(";
      var x1_$_$$und2$f = _2
    } else {
      var _2$1 = $as_T(str.substring(1));
      var x1_$_$$und1$f = "-";
      var x1_$_$$und2$f = _2$1
    };
    var prefix = $as_T(x1_$_$$und1$f);
    var rest0 = $as_T(x1_$_$$und2$f);
    var rest = (((32 & flags) !== 0) ? this.insertGroupingSeps__p1__T__T(rest0) : rest0);
    this.padAndSendToDest__p1__I__I__T__T__V(flags, width, prefix, this.applyUpperCase__p1__I__T__T(flags, rest))
  }
});
$c_ju_Formatter.prototype.parseFlags__p1__T__C__I = (function(flags, conversion) {
  var bits = ((conversion <= 90) ? 256 : 0);
  var len = $uI(flags.length);
  var i = 0;
  while ((i !== len)) {
    var index = i;
    var f = (65535 & $uI(flags.charCodeAt(index)));
    switch (f) {
      case 45: {
        var bit = 1;
        break
      }
      case 35: {
        var bit = 2;
        break
      }
      case 43: {
        var bit = 4;
        break
      }
      case 32: {
        var bit = 8;
        break
      }
      case 48: {
        var bit = 16;
        break
      }
      case 44: {
        var bit = 32;
        break
      }
      case 40: {
        var bit = 64;
        break
      }
      case 60: {
        var bit = 128;
        break
      }
      default: {
        var bit;
        throw new $c_s_MatchError().init___O(new $c_jl_Character().init___C(f))
      }
    };
    if (((bits & bit) !== 0)) {
      throw new $c_ju_DuplicateFormatFlagsException().init___T($as_T($g.String.fromCharCode(f)))
    };
    bits = (bits | bit);
    i = ((1 + i) | 0)
  };
  return bits
});
$c_ju_Formatter.prototype.close__V = (function() {
  if (((!this.java$util$Formatter$$closed$f) && (this.dest$1 !== null))) {
    var x1 = this.dest$1;
    if ($is_Ljava_io_Closeable(x1)) {
      try {
        $as_Ljava_io_Closeable(x1).close__V()
      } catch (e) {
        if ($is_Ljava_io_IOException(e)) {
          var th = $as_Ljava_io_IOException(e);
          this.java$util$Formatter$$lastIOException$f = th
        } else {
          throw e
        }
      }
    }
  };
  this.java$util$Formatter$$closed$f = true
});
var $d_ju_Formatter = new $TypeData().initClass({
  ju_Formatter: 0
}, false, "java.util.Formatter", {
  ju_Formatter: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  jl_AutoCloseable: 1,
  Ljava_io_Flushable: 1
});
$c_ju_Formatter.prototype.$classData = $d_ju_Formatter;
/** @constructor */
function $c_s_Array$() {
  $c_s_FallbackArrayBuilding.call(this)
}
$c_s_Array$.prototype = new $h_s_FallbackArrayBuilding();
$c_s_Array$.prototype.constructor = $c_s_Array$;
/** @constructor */
function $h_s_Array$() {
  /*<skip>*/
}
$h_s_Array$.prototype = $c_s_Array$.prototype;
$c_s_Array$.prototype.init___ = (function() {
  return this
});
$c_s_Array$.prototype.slowcopy__p2__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var i = srcPos;
  var j = destPos;
  var srcUntil = ((srcPos + length) | 0);
  while ((i < srcUntil)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(dest, j, $m_sr_ScalaRunTime$().array$undapply__O__I__O(src, i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
});
$c_s_Array$.prototype.copy__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var srcClass = $objectGetClass(src);
  if ((srcClass.isArray__Z() && $objectGetClass(dest).isAssignableFrom__jl_Class__Z(srcClass))) {
    $systemArraycopy(src, srcPos, dest, destPos, length)
  } else {
    this.slowcopy__p2__O__I__O__I__I__V(src, srcPos, dest, destPos, length)
  }
});
var $d_s_Array$ = new $TypeData().initClass({
  s_Array$: 0
}, false, "scala.Array$", {
  s_Array$: 1,
  s_FallbackArrayBuilding: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Array$.prototype.$classData = $d_s_Array$;
var $n_s_Array$ = (void 0);
function $m_s_Array$() {
  if ((!$n_s_Array$)) {
    $n_s_Array$ = new $c_s_Array$().init___()
  };
  return $n_s_Array$
}
/** @constructor */
function $c_s_math_Equiv$() {
  $c_O.call(this)
}
$c_s_math_Equiv$.prototype = new $h_O();
$c_s_math_Equiv$.prototype.constructor = $c_s_math_Equiv$;
/** @constructor */
function $h_s_math_Equiv$() {
  /*<skip>*/
}
$h_s_math_Equiv$.prototype = $c_s_math_Equiv$.prototype;
$c_s_math_Equiv$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Equiv$ = new $TypeData().initClass({
  s_math_Equiv$: 0
}, false, "scala.math.Equiv$", {
  s_math_Equiv$: 1,
  O: 1,
  s_math_LowPriorityEquiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Equiv$.prototype.$classData = $d_s_math_Equiv$;
var $n_s_math_Equiv$ = (void 0);
function $m_s_math_Equiv$() {
  if ((!$n_s_math_Equiv$)) {
    $n_s_math_Equiv$ = new $c_s_math_Equiv$().init___()
  };
  return $n_s_math_Equiv$
}
/** @constructor */
function $c_s_math_Ordering$() {
  $c_O.call(this)
}
$c_s_math_Ordering$.prototype = new $h_O();
$c_s_math_Ordering$.prototype.constructor = $c_s_math_Ordering$;
/** @constructor */
function $h_s_math_Ordering$() {
  /*<skip>*/
}
$h_s_math_Ordering$.prototype = $c_s_math_Ordering$.prototype;
$c_s_math_Ordering$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Ordering$ = new $TypeData().initClass({
  s_math_Ordering$: 0
}, false, "scala.math.Ordering$", {
  s_math_Ordering$: 1,
  O: 1,
  s_math_LowPriorityOrderingImplicits: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$.prototype.$classData = $d_s_math_Ordering$;
var $n_s_math_Ordering$ = (void 0);
function $m_s_math_Ordering$() {
  if ((!$n_s_math_Ordering$)) {
    $n_s_math_Ordering$ = new $c_s_math_Ordering$().init___()
  };
  return $n_s_math_Ordering$
}
/** @constructor */
function $c_sc_AbstractIterator() {
  $c_O.call(this)
}
$c_sc_AbstractIterator.prototype = new $h_O();
$c_sc_AbstractIterator.prototype.constructor = $c_sc_AbstractIterator;
/** @constructor */
function $h_sc_AbstractIterator() {
  /*<skip>*/
}
$h_sc_AbstractIterator.prototype = $c_sc_AbstractIterator.prototype;
$c_sc_AbstractIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.copyToArray__O__I__V = (function(xs, start) {
  $f_sc_TraversableOnce__copyToArray__O__I__V(this, xs, start)
});
$c_sc_AbstractIterator.prototype.isEmpty__Z = (function() {
  return $f_sc_Iterator__isEmpty__Z(this)
});
$c_sc_AbstractIterator.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractIterator.prototype.toString__T = (function() {
  return $f_sc_Iterator__toString__T(this)
});
$c_sc_AbstractIterator.prototype.foreach__F1__V = (function(f) {
  $f_sc_Iterator__foreach__F1__V(this, f)
});
$c_sc_AbstractIterator.prototype.toBuffer__scm_Buffer = (function() {
  var this$1 = $m_scm_ArrayBuffer$();
  var cbf = this$1.ReusableCBFInstance$2;
  return $as_scm_Buffer($f_sc_TraversableOnce__to__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_AbstractIterator.prototype.size__I = (function() {
  return $f_sc_TraversableOnce__size__I(this)
});
$c_sc_AbstractIterator.prototype.toStream__sci_Stream = (function() {
  return $f_sc_Iterator__toStream__sci_Stream(this)
});
$c_sc_AbstractIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractIterator.prototype.max__s_math_Ordering__O = (function(cmp) {
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this, cmp)
});
$c_sc_AbstractIterator.prototype.isTraversableAgain__Z = (function() {
  return false
});
$c_sc_AbstractIterator.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_Iterator__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sc_AbstractIterator.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O(this, evidence$1)
});
$c_sc_AbstractIterator.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_TraversableOnce__reduceLeft__F2__O(this, op)
});
/** @constructor */
function $c_scm_GrowingBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_GrowingBuilder.prototype = new $h_O();
$c_scm_GrowingBuilder.prototype.constructor = $c_scm_GrowingBuilder;
/** @constructor */
function $h_scm_GrowingBuilder() {
  /*<skip>*/
}
$h_scm_GrowingBuilder.prototype = $c_scm_GrowingBuilder.prototype;
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_GrowingBuilder = (function(x) {
  this.elems$1.$$plus$eq__O__scg_Growable(x);
  return this
});
$c_scm_GrowingBuilder.prototype.init___scg_Growable = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_GrowingBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_GrowingBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_GrowingBuilder = new $TypeData().initClass({
  scm_GrowingBuilder: 0
}, false, "scala.collection.mutable.GrowingBuilder", {
  scm_GrowingBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_GrowingBuilder.prototype.$classData = $d_scm_GrowingBuilder;
/** @constructor */
function $c_sjs_js_WrappedDictionary$DictionaryIterator() {
  $c_O.call(this);
  this.dict$1 = null;
  this.keys$1 = null;
  this.index$1 = 0
}
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype = new $h_O();
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.constructor = $c_sjs_js_WrappedDictionary$DictionaryIterator;
/** @constructor */
function $h_sjs_js_WrappedDictionary$DictionaryIterator() {
  /*<skip>*/
}
$h_sjs_js_WrappedDictionary$DictionaryIterator.prototype = $c_sjs_js_WrappedDictionary$DictionaryIterator.prototype;
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.copyToArray__O__I__V = (function(xs, start) {
  $f_sc_TraversableOnce__copyToArray__O__I__V(this, xs, start)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.next__O = (function() {
  return this.next__T2()
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.isEmpty__Z = (function() {
  return $f_sc_Iterator__isEmpty__Z(this)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.init___sjs_js_Dictionary = (function(dict) {
  this.dict$1 = dict;
  this.keys$1 = $g.Object.keys(dict);
  this.index$1 = 0;
  return this
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.toString__T = (function() {
  return $f_sc_Iterator__toString__T(this)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.foreach__F1__V = (function(f) {
  $f_sc_Iterator__foreach__F1__V(this, f)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.size__I = (function() {
  return $f_sc_TraversableOnce__size__I(this)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.toBuffer__scm_Buffer = (function() {
  var this$1 = $m_scm_ArrayBuffer$();
  var cbf = this$1.ReusableCBFInstance$2;
  return $as_scm_Buffer($f_sc_TraversableOnce__to__scg_CanBuildFrom__O(this, cbf))
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.next__T2 = (function() {
  var key = $as_T(this.keys$1[this.index$1]);
  this.index$1 = ((1 + this.index$1) | 0);
  var dict = this.dict$1;
  if ($uZ($m_sjs_js_WrappedDictionary$Cache$().safeHasOwnProperty$1.call(dict, key))) {
    var jsx$1 = dict[key]
  } else {
    var jsx$1;
    throw new $c_ju_NoSuchElementException().init___T(("key not found: " + key))
  };
  return new $c_T2().init___O__O(key, jsx$1)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.hasNext__Z = (function() {
  return (this.index$1 < $uI(this.keys$1.length))
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.toStream__sci_Stream = (function() {
  return $f_sc_Iterator__toStream__sci_Stream(this)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.max__s_math_Ordering__O = (function(cmp) {
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this, cmp)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_Iterator__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.isTraversableAgain__Z = (function() {
  return false
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O(this, evidence$1)
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_TraversableOnce__reduceLeft__F2__O(this, op)
});
var $d_sjs_js_WrappedDictionary$DictionaryIterator = new $TypeData().initClass({
  sjs_js_WrappedDictionary$DictionaryIterator: 0
}, false, "scala.scalajs.js.WrappedDictionary$DictionaryIterator", {
  sjs_js_WrappedDictionary$DictionaryIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sjs_js_WrappedDictionary$DictionaryIterator.prototype.$classData = $d_sjs_js_WrappedDictionary$DictionaryIterator;
/** @constructor */
function $c_sjsr_RuntimeLong() {
  $c_jl_Number.call(this);
  this.lo$2 = 0;
  this.hi$2 = 0
}
$c_sjsr_RuntimeLong.prototype = new $h_jl_Number();
$c_sjsr_RuntimeLong.prototype.constructor = $c_sjsr_RuntimeLong;
/** @constructor */
function $h_sjsr_RuntimeLong() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong.prototype = $c_sjsr_RuntimeLong.prototype;
$c_sjsr_RuntimeLong.prototype.longValue__J = (function() {
  return $uJ(this)
});
$c_sjsr_RuntimeLong.prototype.$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 | b.lo$2), (this.hi$2 | b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$eq__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) >= ((-2147483648) ^ b.lo$2)) : (ahi > bhi))
});
$c_sjsr_RuntimeLong.prototype.byteValue__B = (function() {
  return ((this.lo$2 << 24) >> 24)
});
$c_sjsr_RuntimeLong.prototype.equals__O__Z = (function(that) {
  if ($is_sjsr_RuntimeLong(that)) {
    var x2 = $as_sjsr_RuntimeLong(that);
    return ((this.lo$2 === x2.lo$2) && (this.hi$2 === x2.hi$2))
  } else {
    return false
  }
});
$c_sjsr_RuntimeLong.prototype.$$less__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) < ((-2147483648) ^ b.lo$2)) : (ahi < bhi))
});
$c_sjsr_RuntimeLong.prototype.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var blo = b.lo$2;
  var a0 = (65535 & alo);
  var a1 = ((alo >>> 16) | 0);
  var b0 = (65535 & blo);
  var b1 = ((blo >>> 16) | 0);
  var a0b0 = $imul(a0, b0);
  var a1b0 = $imul(a1, b0);
  var a0b1 = $imul(a0, b1);
  var lo = ((a0b0 + (((a1b0 + a0b1) | 0) << 16)) | 0);
  var c1part = ((((a0b0 >>> 16) | 0) + a0b1) | 0);
  var hi = (((((((($imul(alo, b.hi$2) + $imul(this.hi$2, blo)) | 0) + $imul(a1, b1)) | 0) + ((c1part >>> 16) | 0)) | 0) + (((((65535 & c1part) + a1b0) | 0) >>> 16) | 0)) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, hi)
});
$c_sjsr_RuntimeLong.prototype.init___I__I__I = (function(l, m, h) {
  $c_sjsr_RuntimeLong.prototype.init___I__I.call(this, (l | (m << 22)), ((m >> 10) | (h << 12)));
  return this
});
$c_sjsr_RuntimeLong.prototype.$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo = this$1.remainderImpl__I__I__I__I__I(this.lo$2, this.hi$2, b.lo$2, b.hi$2);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong.prototype.toString__T = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toString__I__I__T(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.init___I__I = (function(lo, hi) {
  this.lo$2 = lo;
  this.hi$2 = hi;
  return this
});
$c_sjsr_RuntimeLong.prototype.compareTo__O__I = (function(x$1) {
  var that = $as_sjsr_RuntimeLong(x$1);
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I(this.lo$2, this.hi$2, that.lo$2, that.hi$2)
});
$c_sjsr_RuntimeLong.prototype.$$less$eq__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) <= ((-2147483648) ^ b.lo$2)) : (ahi < bhi))
});
$c_sjsr_RuntimeLong.prototype.$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 & b.lo$2), (this.hi$2 & b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater$greater__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (((this.lo$2 >>> n) | 0) | ((this.hi$2 << 1) << ((31 - n) | 0))) : ((this.hi$2 >>> n) | 0)), (((32 & n) === 0) ? ((this.hi$2 >>> n) | 0) : 0))
});
$c_sjsr_RuntimeLong.prototype.$$greater__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) > ((-2147483648) ^ b.lo$2)) : (ahi > bhi))
});
$c_sjsr_RuntimeLong.prototype.$$less$less__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (this.lo$2 << n) : 0), (((32 & n) === 0) ? (((((this.lo$2 >>> 1) | 0) >>> ((31 - n) | 0)) | 0) | (this.hi$2 << n)) : (this.lo$2 << n)))
});
$c_sjsr_RuntimeLong.prototype.init___I = (function(value) {
  $c_sjsr_RuntimeLong.prototype.init___I__I.call(this, value, (value >> 31));
  return this
});
$c_sjsr_RuntimeLong.prototype.toInt__I = (function() {
  return this.lo$2
});
$c_sjsr_RuntimeLong.prototype.notEquals__sjsr_RuntimeLong__Z = (function(b) {
  return (!((this.lo$2 === b.lo$2) && (this.hi$2 === b.hi$2)))
});
$c_sjsr_RuntimeLong.prototype.unary$und$minus__sjsr_RuntimeLong = (function() {
  var lo = this.lo$2;
  var hi = this.hi$2;
  return new $c_sjsr_RuntimeLong().init___I__I(((-lo) | 0), ((lo !== 0) ? (~hi) : ((-hi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  var lo = ((alo + b.lo$2) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, ((((-2147483648) ^ lo) < ((-2147483648) ^ alo)) ? ((1 + ((ahi + bhi) | 0)) | 0) : ((ahi + bhi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.shortValue__S = (function() {
  return ((this.lo$2 << 16) >> 16)
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (((this.lo$2 >>> n) | 0) | ((this.hi$2 << 1) << ((31 - n) | 0))) : (this.hi$2 >> n)), (((32 & n) === 0) ? (this.hi$2 >> n) : (this.hi$2 >> 31)))
});
$c_sjsr_RuntimeLong.prototype.toDouble__D = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.$$div__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo = this$1.divideImpl__I__I__I__I__I(this.lo$2, this.hi$2, b.lo$2, b.hi$2);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong.prototype.doubleValue__D = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.hashCode__I = (function() {
  return (this.lo$2 ^ this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.intValue__I = (function() {
  return this.lo$2
});
$c_sjsr_RuntimeLong.prototype.unary$und$tilde__sjsr_RuntimeLong = (function() {
  return new $c_sjsr_RuntimeLong().init___I__I((~this.lo$2), (~this.hi$2))
});
$c_sjsr_RuntimeLong.prototype.compareTo__jl_Long__I = (function(that) {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I(this.lo$2, this.hi$2, that.lo$2, that.hi$2)
});
$c_sjsr_RuntimeLong.prototype.floatValue__F = (function() {
  return $fround($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  var lo = ((alo - b.lo$2) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, ((((-2147483648) ^ lo) > ((-2147483648) ^ alo)) ? (((-1) + ((ahi - bhi) | 0)) | 0) : ((ahi - bhi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 ^ b.lo$2), (this.hi$2 ^ b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.equals__sjsr_RuntimeLong__Z = (function(b) {
  return ((this.lo$2 === b.lo$2) && (this.hi$2 === b.hi$2))
});
function $is_sjsr_RuntimeLong(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjsr_RuntimeLong)))
}
function $as_sjsr_RuntimeLong(obj) {
  return (($is_sjsr_RuntimeLong(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.runtime.RuntimeLong"))
}
function $isArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjsr_RuntimeLong)))
}
function $asArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (($isArrayOf_sjsr_RuntimeLong(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.runtime.RuntimeLong;", depth))
}
var $d_sjsr_RuntimeLong = new $TypeData().initClass({
  sjsr_RuntimeLong: 0
}, false, "scala.scalajs.runtime.RuntimeLong", {
  sjsr_RuntimeLong: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
});
$c_sjsr_RuntimeLong.prototype.$classData = $d_sjsr_RuntimeLong;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Mod() {
  $c_O.call(this);
  this.mod$1 = null
}
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Mod;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Mod() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Mod.prototype = $c_Ljapgolly_scalajs_react_CtorType$Mod.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.productPrefix__T = (function() {
  return "Mod"
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_CtorType$Mod$().equals$extension__F1__O__Z(this.mod$1, x$1)
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.productElement__I__O = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_CtorType$Mod$().productElement$extension__F1__I__O(this.mod$1, x$1)
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_CtorType$Mod$().toString$extension__F1__T(this.mod$1)
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.init___F1 = (function(mod) {
  this.mod$1 = mod;
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.hashCode__I = (function() {
  var $$this = this.mod$1;
  return $$this.hashCode__I()
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.productIterator__sc_Iterator = (function() {
  return $m_Ljapgolly_scalajs_react_CtorType$Mod$().productIterator$extension__F1__sc_Iterator(this.mod$1)
});
function $is_Ljapgolly_scalajs_react_CtorType$Mod(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_CtorType$Mod)))
}
function $as_Ljapgolly_scalajs_react_CtorType$Mod(obj) {
  return (($is_Ljapgolly_scalajs_react_CtorType$Mod(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.CtorType$Mod"))
}
function $isArrayOf_Ljapgolly_scalajs_react_CtorType$Mod(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_CtorType$Mod)))
}
function $asArrayOf_Ljapgolly_scalajs_react_CtorType$Mod(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_CtorType$Mod(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.CtorType$Mod;", depth))
}
var $d_Ljapgolly_scalajs_react_CtorType$Mod = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Mod: 0
}, false, "japgolly.scalajs.react.CtorType$Mod", {
  Ljapgolly_scalajs_react_CtorType$Mod: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Mod.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Mod;
/** @constructor */
function $c_Ljapgolly_scalajs_react_CtorType$Mod$() {
  $c_sr_AbstractFunction1.call(this)
}
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype = new $h_sr_AbstractFunction1();
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.constructor = $c_Ljapgolly_scalajs_react_CtorType$Mod$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_CtorType$Mod$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_CtorType$Mod$.prototype = $c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype;
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.init___ = (function() {
  return this
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.productElement$extension__F1__I__O = (function($$this, x$1) {
  switch (x$1) {
    case 0: {
      return $$this;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.apply__O__O = (function(v1) {
  var mod = $as_F1(v1);
  return new $c_Ljapgolly_scalajs_react_CtorType$Mod().init___F1(mod)
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.productIterator$extension__F1__sc_Iterator = (function($$this) {
  var x = new $c_Ljapgolly_scalajs_react_CtorType$Mod().init___F1($$this);
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(x)
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.toString__T = (function() {
  return "Mod"
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.toString$extension__F1__T = (function($$this) {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(new $c_Ljapgolly_scalajs_react_CtorType$Mod().init___F1($$this))
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.applyAndCast$extension__F1__sjs_js_Object__sjs_js_Object = (function($$this, o) {
  $$this.apply__O__O(o);
  return o
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.equals$extension__F1__O__Z = (function($$this, x$1) {
  if ($is_Ljapgolly_scalajs_react_CtorType$Mod(x$1)) {
    var Mod$1 = ((x$1 === null) ? null : $as_Ljapgolly_scalajs_react_CtorType$Mod(x$1).mod$1);
    return (($$this === null) ? (Mod$1 === null) : $$this.equals__O__Z(Mod$1))
  } else {
    return false
  }
});
var $d_Ljapgolly_scalajs_react_CtorType$Mod$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_CtorType$Mod$: 0
}, false, "japgolly.scalajs.react.CtorType$Mod$", {
  Ljapgolly_scalajs_react_CtorType$Mod$: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_CtorType$Mod$.prototype.$classData = $d_Ljapgolly_scalajs_react_CtorType$Mod$;
var $n_Ljapgolly_scalajs_react_CtorType$Mod$ = (void 0);
function $m_Ljapgolly_scalajs_react_CtorType$Mod$() {
  if ((!$n_Ljapgolly_scalajs_react_CtorType$Mod$)) {
    $n_Ljapgolly_scalajs_react_CtorType$Mod$ = new $c_Ljapgolly_scalajs_react_CtorType$Mod$().init___()
  };
  return $n_Ljapgolly_scalajs_react_CtorType$Mod$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle() {
  $c_O.call(this);
  this.componentDidMount$1 = null;
  this.componentDidUpdate$1 = null;
  this.componentWillMount$1 = null;
  this.componentWillReceiveProps$1 = null;
  this.componentWillUnmount$1 = null;
  this.componentWillUpdate$1 = null;
  this.shouldComponentUpdate$1 = null;
  this.componentDidCatch$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.productPrefix__T = (function() {
  return "Lifecycle"
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.productArity__I = (function() {
  return 8
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_component_builder_Lifecycle(x$1)) {
    var Lifecycle$1 = $as_Ljapgolly_scalajs_react_component_builder_Lifecycle(x$1);
    var x = this.componentDidMount$1;
    var x$2 = Lifecycle$1.componentDidMount$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.componentDidUpdate$1;
      var x$4 = Lifecycle$1.componentDidUpdate$1;
      var jsx$6 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$6 = false
    };
    if (jsx$6) {
      var x$5 = this.componentWillMount$1;
      var x$6 = Lifecycle$1.componentWillMount$1;
      var jsx$5 = ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      var jsx$5 = false
    };
    if (jsx$5) {
      var x$7 = this.componentWillReceiveProps$1;
      var x$8 = Lifecycle$1.componentWillReceiveProps$1;
      var jsx$4 = ((x$7 === null) ? (x$8 === null) : x$7.equals__O__Z(x$8))
    } else {
      var jsx$4 = false
    };
    if (jsx$4) {
      var x$9 = this.componentWillUnmount$1;
      var x$10 = Lifecycle$1.componentWillUnmount$1;
      var jsx$3 = ((x$9 === null) ? (x$10 === null) : x$9.equals__O__Z(x$10))
    } else {
      var jsx$3 = false
    };
    if (jsx$3) {
      var x$11 = this.componentWillUpdate$1;
      var x$12 = Lifecycle$1.componentWillUpdate$1;
      var jsx$2 = ((x$11 === null) ? (x$12 === null) : x$11.equals__O__Z(x$12))
    } else {
      var jsx$2 = false
    };
    if (jsx$2) {
      var x$13 = this.shouldComponentUpdate$1;
      var x$14 = Lifecycle$1.shouldComponentUpdate$1;
      var jsx$1 = ((x$13 === null) ? (x$14 === null) : x$13.equals__O__Z(x$14))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var x$15 = this.componentDidCatch$1;
      var x$16 = Lifecycle$1.componentDidCatch$1;
      return ((x$15 === null) ? (x$16 === null) : x$15.equals__O__Z(x$16))
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.componentDidMount$1;
      break
    }
    case 1: {
      return this.componentDidUpdate$1;
      break
    }
    case 2: {
      return this.componentWillMount$1;
      break
    }
    case 3: {
      return this.componentWillReceiveProps$1;
      break
    }
    case 4: {
      return this.componentWillUnmount$1;
      break
    }
    case 5: {
      return this.componentWillUpdate$1;
      break
    }
    case 6: {
      return this.shouldComponentUpdate$1;
      break
    }
    case 7: {
      return this.componentDidCatch$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.init___s_Option__s_Option__s_Option__s_Option__s_Option__s_Option__s_Option__s_Option = (function(componentDidMount, componentDidUpdate, componentWillMount, componentWillReceiveProps, componentWillUnmount, componentWillUpdate, shouldComponentUpdate, componentDidCatch) {
  this.componentDidMount$1 = componentDidMount;
  this.componentDidUpdate$1 = componentDidUpdate;
  this.componentWillMount$1 = componentWillMount;
  this.componentWillReceiveProps$1 = componentWillReceiveProps;
  this.componentWillUnmount$1 = componentWillUnmount;
  this.componentWillUpdate$1 = componentWillUpdate;
  this.shouldComponentUpdate$1 = shouldComponentUpdate;
  this.componentDidCatch$1 = componentDidCatch;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle)))
}
function $as_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj) {
  return (($is_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.builder.Lifecycle"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.builder.Lifecycle;", depth))
}
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle;
/** @constructor */
function $c_Ljava_io_FilterOutputStream() {
  $c_Ljava_io_OutputStream.call(this);
  this.out$2 = null
}
$c_Ljava_io_FilterOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_Ljava_io_FilterOutputStream.prototype.constructor = $c_Ljava_io_FilterOutputStream;
/** @constructor */
function $h_Ljava_io_FilterOutputStream() {
  /*<skip>*/
}
$h_Ljava_io_FilterOutputStream.prototype = $c_Ljava_io_FilterOutputStream.prototype;
$c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  this.out$2 = out;
  return this
});
/** @constructor */
function $c_Lorg_rebeam_MultiSelect$Props() {
  $c_O.call(this);
  this.items$1 = null;
  this.selectedItems$1 = null;
  this.onSelectionChange$1 = null;
  this.itemToString$1 = null;
  this.itemToKey$1 = null;
  this.maxMenuItems$1 = 0;
  this.nothingFound$1 = null;
  this.moreAvailable$1 = null;
  this.placeholder$1 = null
}
$c_Lorg_rebeam_MultiSelect$Props.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelect$Props.prototype.constructor = $c_Lorg_rebeam_MultiSelect$Props;
/** @constructor */
function $h_Lorg_rebeam_MultiSelect$Props() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelect$Props.prototype = $c_Lorg_rebeam_MultiSelect$Props.prototype;
$c_Lorg_rebeam_MultiSelect$Props.prototype.productPrefix__T = (function() {
  return "Props"
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.productArity__I = (function() {
  return 9
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_MultiSelect$Props(x$1)) {
    var Props$1 = $as_Lorg_rebeam_MultiSelect$Props(x$1);
    var x = this.items$1;
    var x$2 = Props$1.items$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.selectedItems$1;
      var x$4 = Props$1.selectedItems$1;
      var jsx$4 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$4 = false
    };
    if (jsx$4) {
      var x$5 = this.onSelectionChange$1;
      var x$6 = Props$1.onSelectionChange$1;
      var jsx$3 = ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      var jsx$3 = false
    };
    if (jsx$3) {
      var x$7 = this.itemToString$1;
      var x$8 = Props$1.itemToString$1;
      var jsx$2 = ((x$7 === null) ? (x$8 === null) : x$7.equals__O__Z(x$8))
    } else {
      var jsx$2 = false
    };
    if (jsx$2) {
      var x$9 = this.itemToKey$1;
      var x$10 = Props$1.itemToKey$1;
      var jsx$1 = (x$9 === x$10)
    } else {
      var jsx$1 = false
    };
    if ((((jsx$1 && (this.maxMenuItems$1 === Props$1.maxMenuItems$1)) && (this.nothingFound$1 === Props$1.nothingFound$1)) && (this.moreAvailable$1 === Props$1.moreAvailable$1))) {
      return (this.placeholder$1 === Props$1.placeholder$1)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.items$1;
      break
    }
    case 1: {
      return this.selectedItems$1;
      break
    }
    case 2: {
      return this.onSelectionChange$1;
      break
    }
    case 3: {
      return this.itemToString$1;
      break
    }
    case 4: {
      return this.itemToKey$1;
      break
    }
    case 5: {
      return this.maxMenuItems$1;
      break
    }
    case 6: {
      return this.nothingFound$1;
      break
    }
    case 7: {
      return this.moreAvailable$1;
      break
    }
    case 8: {
      return this.placeholder$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.init___sci_List__sci_List__F1__F1__F2__I__T__T__T = (function(items, selectedItems, onSelectionChange, itemToString, itemToKey, maxMenuItems, nothingFound, moreAvailable, placeholder) {
  this.items$1 = items;
  this.selectedItems$1 = selectedItems;
  this.onSelectionChange$1 = onSelectionChange;
  this.itemToString$1 = itemToString;
  this.itemToKey$1 = itemToKey;
  this.maxMenuItems$1 = maxMenuItems;
  this.nothingFound$1 = nothingFound;
  this.moreAvailable$1 = moreAvailable;
  this.placeholder$1 = placeholder;
  return this
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.items$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.selectedItems$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.onSelectionChange$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.itemToString$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.itemToKey$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.maxMenuItems$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.nothingFound$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.moreAvailable$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.placeholder$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 9)
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_MultiSelect$Props(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelect$Props)))
}
function $as_Lorg_rebeam_MultiSelect$Props(obj) {
  return (($is_Lorg_rebeam_MultiSelect$Props(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelect$Props"))
}
function $isArrayOf_Lorg_rebeam_MultiSelect$Props(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelect$Props)))
}
function $asArrayOf_Lorg_rebeam_MultiSelect$Props(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelect$Props(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelect$Props;", depth))
}
var $d_Lorg_rebeam_MultiSelect$Props = new $TypeData().initClass({
  Lorg_rebeam_MultiSelect$Props: 0
}, false, "org.rebeam.MultiSelect$Props", {
  Lorg_rebeam_MultiSelect$Props: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelect$Props.prototype.$classData = $d_Lorg_rebeam_MultiSelect$Props;
/** @constructor */
function $c_Lorg_rebeam_MultiSelect$State() {
  $c_O.call(this);
  this.inputValue$1 = null
}
$c_Lorg_rebeam_MultiSelect$State.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelect$State.prototype.constructor = $c_Lorg_rebeam_MultiSelect$State;
/** @constructor */
function $h_Lorg_rebeam_MultiSelect$State() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelect$State.prototype = $c_Lorg_rebeam_MultiSelect$State.prototype;
$c_Lorg_rebeam_MultiSelect$State.prototype.productPrefix__T = (function() {
  return "State"
});
$c_Lorg_rebeam_MultiSelect$State.prototype.productArity__I = (function() {
  return 1
});
$c_Lorg_rebeam_MultiSelect$State.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_MultiSelect$State(x$1)) {
    var State$1 = $as_Lorg_rebeam_MultiSelect$State(x$1);
    return (this.inputValue$1 === State$1.inputValue$1)
  } else {
    return false
  }
});
$c_Lorg_rebeam_MultiSelect$State.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.inputValue$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_MultiSelect$State.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_MultiSelect$State.prototype.init___T = (function(inputValue) {
  this.inputValue$1 = inputValue;
  return this
});
$c_Lorg_rebeam_MultiSelect$State.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lorg_rebeam_MultiSelect$State.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_MultiSelect$State(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelect$State)))
}
function $as_Lorg_rebeam_MultiSelect$State(obj) {
  return (($is_Lorg_rebeam_MultiSelect$State(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelect$State"))
}
function $isArrayOf_Lorg_rebeam_MultiSelect$State(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelect$State)))
}
function $asArrayOf_Lorg_rebeam_MultiSelect$State(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelect$State(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelect$State;", depth))
}
var $d_Lorg_rebeam_MultiSelect$State = new $TypeData().initClass({
  Lorg_rebeam_MultiSelect$State: 0
}, false, "org.rebeam.MultiSelect$State", {
  Lorg_rebeam_MultiSelect$State: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelect$State.prototype.$classData = $d_Lorg_rebeam_MultiSelect$State;
/** @constructor */
function $c_Lorg_rebeam_MultiSelectDemo$Country() {
  $c_O.call(this);
  this.name$1 = null;
  this.code$1 = null
}
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.constructor = $c_Lorg_rebeam_MultiSelectDemo$Country;
/** @constructor */
function $h_Lorg_rebeam_MultiSelectDemo$Country() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelectDemo$Country.prototype = $c_Lorg_rebeam_MultiSelectDemo$Country.prototype;
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.init___T__T = (function(name, code) {
  this.name$1 = name;
  this.code$1 = code;
  return this
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.productPrefix__T = (function() {
  return "Country"
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.productArity__I = (function() {
  return 2
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_MultiSelectDemo$Country(x$1)) {
    var Country$1 = $as_Lorg_rebeam_MultiSelectDemo$Country(x$1);
    return ((this.name$1 === Country$1.name$1) && (this.code$1 === Country$1.code$1))
  } else {
    return false
  }
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.name$1;
      break
    }
    case 1: {
      return this.code$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_MultiSelectDemo$Country(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelectDemo$Country)))
}
function $as_Lorg_rebeam_MultiSelectDemo$Country(obj) {
  return (($is_Lorg_rebeam_MultiSelectDemo$Country(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelectDemo$Country"))
}
function $isArrayOf_Lorg_rebeam_MultiSelectDemo$Country(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelectDemo$Country)))
}
function $asArrayOf_Lorg_rebeam_MultiSelectDemo$Country(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelectDemo$Country(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelectDemo$Country;", depth))
}
var $d_Lorg_rebeam_MultiSelectDemo$Country = new $TypeData().initClass({
  Lorg_rebeam_MultiSelectDemo$Country: 0
}, false, "org.rebeam.MultiSelectDemo$Country", {
  Lorg_rebeam_MultiSelectDemo$Country: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelectDemo$Country.prototype.$classData = $d_Lorg_rebeam_MultiSelectDemo$Country;
/** @constructor */
function $c_Lorg_rebeam_MultiSelectDemo$Props() {
  $c_O.call(this);
  this.items$1 = null
}
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.constructor = $c_Lorg_rebeam_MultiSelectDemo$Props;
/** @constructor */
function $h_Lorg_rebeam_MultiSelectDemo$Props() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelectDemo$Props.prototype = $c_Lorg_rebeam_MultiSelectDemo$Props.prototype;
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.productPrefix__T = (function() {
  return "Props"
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.productArity__I = (function() {
  return 1
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_MultiSelectDemo$Props(x$1)) {
    var Props$1 = $as_Lorg_rebeam_MultiSelectDemo$Props(x$1);
    var x = this.items$1;
    var x$2 = Props$1.items$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.items$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.init___sci_List = (function(items) {
  this.items$1 = items;
  return this
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_MultiSelectDemo$Props(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelectDemo$Props)))
}
function $as_Lorg_rebeam_MultiSelectDemo$Props(obj) {
  return (($is_Lorg_rebeam_MultiSelectDemo$Props(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelectDemo$Props"))
}
function $isArrayOf_Lorg_rebeam_MultiSelectDemo$Props(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelectDemo$Props)))
}
function $asArrayOf_Lorg_rebeam_MultiSelectDemo$Props(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelectDemo$Props(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelectDemo$Props;", depth))
}
var $d_Lorg_rebeam_MultiSelectDemo$Props = new $TypeData().initClass({
  Lorg_rebeam_MultiSelectDemo$Props: 0
}, false, "org.rebeam.MultiSelectDemo$Props", {
  Lorg_rebeam_MultiSelectDemo$Props: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelectDemo$Props.prototype.$classData = $d_Lorg_rebeam_MultiSelectDemo$Props;
/** @constructor */
function $c_Lorg_rebeam_MultiSelectDemo$State() {
  $c_O.call(this);
  this.selectedItems$1 = null
}
$c_Lorg_rebeam_MultiSelectDemo$State.prototype = new $h_O();
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.constructor = $c_Lorg_rebeam_MultiSelectDemo$State;
/** @constructor */
function $h_Lorg_rebeam_MultiSelectDemo$State() {
  /*<skip>*/
}
$h_Lorg_rebeam_MultiSelectDemo$State.prototype = $c_Lorg_rebeam_MultiSelectDemo$State.prototype;
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.productPrefix__T = (function() {
  return "State"
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.productArity__I = (function() {
  return 1
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_MultiSelectDemo$State(x$1)) {
    var State$1 = $as_Lorg_rebeam_MultiSelectDemo$State(x$1);
    var x = this.selectedItems$1;
    var x$2 = State$1.selectedItems$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.selectedItems$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.init___sci_List = (function(selectedItems) {
  this.selectedItems$1 = selectedItems;
  return this
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_MultiSelectDemo$State(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_MultiSelectDemo$State)))
}
function $as_Lorg_rebeam_MultiSelectDemo$State(obj) {
  return (($is_Lorg_rebeam_MultiSelectDemo$State(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.MultiSelectDemo$State"))
}
function $isArrayOf_Lorg_rebeam_MultiSelectDemo$State(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_MultiSelectDemo$State)))
}
function $asArrayOf_Lorg_rebeam_MultiSelectDemo$State(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_MultiSelectDemo$State(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.MultiSelectDemo$State;", depth))
}
var $d_Lorg_rebeam_MultiSelectDemo$State = new $TypeData().initClass({
  Lorg_rebeam_MultiSelectDemo$State: 0
}, false, "org.rebeam.MultiSelectDemo$State", {
  Lorg_rebeam_MultiSelectDemo$State: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_MultiSelectDemo$State.prototype.$classData = $d_Lorg_rebeam_MultiSelectDemo$State;
/** @constructor */
function $c_Lorg_rebeam_TextFieldDemo$State() {
  $c_O.call(this);
  this.inputValue$1 = null
}
$c_Lorg_rebeam_TextFieldDemo$State.prototype = new $h_O();
$c_Lorg_rebeam_TextFieldDemo$State.prototype.constructor = $c_Lorg_rebeam_TextFieldDemo$State;
/** @constructor */
function $h_Lorg_rebeam_TextFieldDemo$State() {
  /*<skip>*/
}
$h_Lorg_rebeam_TextFieldDemo$State.prototype = $c_Lorg_rebeam_TextFieldDemo$State.prototype;
$c_Lorg_rebeam_TextFieldDemo$State.prototype.productPrefix__T = (function() {
  return "State"
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.productArity__I = (function() {
  return 1
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_TextFieldDemo$State(x$1)) {
    var State$1 = $as_Lorg_rebeam_TextFieldDemo$State(x$1);
    return (this.inputValue$1 === State$1.inputValue$1)
  } else {
    return false
  }
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.inputValue$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.init___T = (function(inputValue) {
  this.inputValue$1 = inputValue;
  return this
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_TextFieldDemo$State(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_TextFieldDemo$State)))
}
function $as_Lorg_rebeam_TextFieldDemo$State(obj) {
  return (($is_Lorg_rebeam_TextFieldDemo$State(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.TextFieldDemo$State"))
}
function $isArrayOf_Lorg_rebeam_TextFieldDemo$State(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_TextFieldDemo$State)))
}
function $asArrayOf_Lorg_rebeam_TextFieldDemo$State(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_TextFieldDemo$State(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.TextFieldDemo$State;", depth))
}
var $d_Lorg_rebeam_TextFieldDemo$State = new $TypeData().initClass({
  Lorg_rebeam_TextFieldDemo$State: 0
}, false, "org.rebeam.TextFieldDemo$State", {
  Lorg_rebeam_TextFieldDemo$State: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_TextFieldDemo$State.prototype.$classData = $d_Lorg_rebeam_TextFieldDemo$State;
/** @constructor */
function $c_Lorg_rebeam_downshift_Downshift$ItemData() {
  $c_O.call(this);
  this.item$1 = null;
  this.index$1 = 0;
  this.disabled$1 = false
}
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype = new $h_O();
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.constructor = $c_Lorg_rebeam_downshift_Downshift$ItemData;
/** @constructor */
function $h_Lorg_rebeam_downshift_Downshift$ItemData() {
  /*<skip>*/
}
$h_Lorg_rebeam_downshift_Downshift$ItemData.prototype = $c_Lorg_rebeam_downshift_Downshift$ItemData.prototype;
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.productPrefix__T = (function() {
  return "ItemData"
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.productArity__I = (function() {
  return 3
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_downshift_Downshift$ItemData(x$1)) {
    var ItemData$1 = $as_Lorg_rebeam_downshift_Downshift$ItemData(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.item$1, ItemData$1.item$1) && (this.index$1 === ItemData$1.index$1)) && (this.disabled$1 === ItemData$1.disabled$1))
  } else {
    return false
  }
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.item$1;
      break
    }
    case 1: {
      return this.index$1;
      break
    }
    case 2: {
      return this.disabled$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.toJS__Lorg_rebeam_downshift_Downshift$GetItemPropsParams = (function() {
  var p = {};
  p.item = this.item$1;
  var value = this.index$1;
  p.index = value;
  var value$1 = this.disabled$1;
  p.disabled = value$1;
  return p
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.init___O__I__Z = (function(item, index, disabled) {
  this.item$1 = item;
  this.index$1 = index;
  this.disabled$1 = disabled;
  return this
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.item$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.index$1);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.disabled$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 3)
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_downshift_Downshift$ItemData(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_downshift_Downshift$ItemData)))
}
function $as_Lorg_rebeam_downshift_Downshift$ItemData(obj) {
  return (($is_Lorg_rebeam_downshift_Downshift$ItemData(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.downshift.Downshift$ItemData"))
}
function $isArrayOf_Lorg_rebeam_downshift_Downshift$ItemData(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_downshift_Downshift$ItemData)))
}
function $asArrayOf_Lorg_rebeam_downshift_Downshift$ItemData(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_downshift_Downshift$ItemData(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.downshift.Downshift$ItemData;", depth))
}
var $d_Lorg_rebeam_downshift_Downshift$ItemData = new $TypeData().initClass({
  Lorg_rebeam_downshift_Downshift$ItemData: 0
}, false, "org.rebeam.downshift.Downshift$ItemData", {
  Lorg_rebeam_downshift_Downshift$ItemData: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_downshift_Downshift$ItemData.prototype.$classData = $d_Lorg_rebeam_downshift_Downshift$ItemData;
/** @constructor */
function $c_Lorg_rebeam_downshift_Downshift$RenderState() {
  $c_O.call(this);
  this.getToggleButtonProps$1 = null;
  this.getInputProps$1 = null;
  this.getItemProps$1 = null;
  this.getLabelProps$1 = null;
  this.getMenuProps$1 = null;
  this.getRootProps$1 = null;
  this.isOpen$1 = false;
  this.inputValue$1 = null;
  this.highlightedIndex$1 = null;
  this.selectedItem$1 = null;
  this.id$1 = null;
  this.openMenu$1 = null;
  this.closeMenu$1 = null;
  this.selectItemAtIndex$1 = null;
  this.setHighlightedIndex$1 = null
}
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype = new $h_O();
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.constructor = $c_Lorg_rebeam_downshift_Downshift$RenderState;
/** @constructor */
function $h_Lorg_rebeam_downshift_Downshift$RenderState() {
  /*<skip>*/
}
$h_Lorg_rebeam_downshift_Downshift$RenderState.prototype = $c_Lorg_rebeam_downshift_Downshift$RenderState.prototype;
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.productPrefix__T = (function() {
  return "RenderState"
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.productArity__I = (function() {
  return 15
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lorg_rebeam_downshift_Downshift$RenderState(x$1)) {
    var RenderState$1 = $as_Lorg_rebeam_downshift_Downshift$RenderState(x$1);
    var x = this.getToggleButtonProps$1;
    var x$2 = RenderState$1.getToggleButtonProps$1;
    if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
      var x$3 = this.getInputProps$1;
      var x$4 = RenderState$1.getInputProps$1;
      var jsx$7 = ((x$3 === null) ? (x$4 === null) : x$3.equals__O__Z(x$4))
    } else {
      var jsx$7 = false
    };
    if (jsx$7) {
      var x$5 = this.getItemProps$1;
      var x$6 = RenderState$1.getItemProps$1;
      var jsx$6 = ((x$5 === null) ? (x$6 === null) : x$5.equals__O__Z(x$6))
    } else {
      var jsx$6 = false
    };
    if (jsx$6) {
      var x$7 = this.getLabelProps$1;
      var x$8 = RenderState$1.getLabelProps$1;
      var jsx$5 = ((x$7 === null) ? (x$8 === null) : x$7.equals__O__Z(x$8))
    } else {
      var jsx$5 = false
    };
    if (jsx$5) {
      var x$9 = this.getMenuProps$1;
      var x$10 = RenderState$1.getMenuProps$1;
      var jsx$4 = ((x$9 === null) ? (x$10 === null) : x$9.equals__O__Z(x$10))
    } else {
      var jsx$4 = false
    };
    if (jsx$4) {
      var x$11 = this.getRootProps$1;
      var x$12 = RenderState$1.getRootProps$1;
      var jsx$3 = ((x$11 === null) ? (x$12 === null) : x$11.equals__O__Z(x$12))
    } else {
      var jsx$3 = false
    };
    if (((jsx$3 && (this.isOpen$1 === RenderState$1.isOpen$1)) && (this.inputValue$1 === RenderState$1.inputValue$1))) {
      var x$13 = this.highlightedIndex$1;
      var x$14 = RenderState$1.highlightedIndex$1;
      var jsx$2 = ((x$13 === null) ? (x$14 === null) : x$13.equals__O__Z(x$14))
    } else {
      var jsx$2 = false
    };
    if (jsx$2) {
      var x$15 = this.selectedItem$1;
      var x$16 = RenderState$1.selectedItem$1;
      var jsx$1 = ((x$15 === null) ? (x$16 === null) : x$15.equals__O__Z(x$16))
    } else {
      var jsx$1 = false
    };
    if (((((jsx$1 && (this.id$1 === RenderState$1.id$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.openMenu$1, RenderState$1.openMenu$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.closeMenu$1, RenderState$1.closeMenu$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.selectItemAtIndex$1, RenderState$1.selectItemAtIndex$1))) {
      return $m_sr_BoxesRunTime$().equals__O__O__Z(this.setHighlightedIndex$1, RenderState$1.setHighlightedIndex$1)
    } else {
      return false
    }
  } else {
    return false
  }
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.getToggleButtonProps$1;
      break
    }
    case 1: {
      return this.getInputProps$1;
      break
    }
    case 2: {
      return this.getItemProps$1;
      break
    }
    case 3: {
      return this.getLabelProps$1;
      break
    }
    case 4: {
      return this.getMenuProps$1;
      break
    }
    case 5: {
      return this.getRootProps$1;
      break
    }
    case 6: {
      return this.isOpen$1;
      break
    }
    case 7: {
      return this.inputValue$1;
      break
    }
    case 8: {
      return this.highlightedIndex$1;
      break
    }
    case 9: {
      return this.selectedItem$1;
      break
    }
    case 10: {
      return this.id$1;
      break
    }
    case 11: {
      return this.openMenu$1;
      break
    }
    case 12: {
      return this.closeMenu$1;
      break
    }
    case 13: {
      return this.selectItemAtIndex$1;
      break
    }
    case 14: {
      return this.setHighlightedIndex$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getToggleButtonProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getInputProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getItemProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getLabelProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getMenuProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.getRootProps$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.isOpen$1 ? 1231 : 1237));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.inputValue$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.highlightedIndex$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.selectedItem$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.id$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.openMenu$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.closeMenu$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.selectItemAtIndex$1));
  acc = $m_sr_Statics$().mix__I__I__I(acc, $m_sr_Statics$().anyHash__O__I(this.setHighlightedIndex$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 15)
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.init___F1__F1__F1__F1__F1__F1__Z__T__s_Option__s_Option__T__sjs_js_Function0__sjs_js_Function0__sjs_js_Function1__sjs_js_Function1 = (function(getToggleButtonProps, getInputProps, getItemProps, getLabelProps, getMenuProps, getRootProps, isOpen, inputValue, highlightedIndex, selectedItem, id, openMenu, closeMenu, selectItemAtIndex, setHighlightedIndex) {
  this.getToggleButtonProps$1 = getToggleButtonProps;
  this.getInputProps$1 = getInputProps;
  this.getItemProps$1 = getItemProps;
  this.getLabelProps$1 = getLabelProps;
  this.getMenuProps$1 = getMenuProps;
  this.getRootProps$1 = getRootProps;
  this.isOpen$1 = isOpen;
  this.inputValue$1 = inputValue;
  this.highlightedIndex$1 = highlightedIndex;
  this.selectedItem$1 = selectedItem;
  this.id$1 = id;
  this.openMenu$1 = openMenu;
  this.closeMenu$1 = closeMenu;
  this.selectItemAtIndex$1 = selectItemAtIndex;
  this.setHighlightedIndex$1 = setHighlightedIndex;
  return this
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lorg_rebeam_downshift_Downshift$RenderState(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_downshift_Downshift$RenderState)))
}
function $as_Lorg_rebeam_downshift_Downshift$RenderState(obj) {
  return (($is_Lorg_rebeam_downshift_Downshift$RenderState(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.downshift.Downshift$RenderState"))
}
function $isArrayOf_Lorg_rebeam_downshift_Downshift$RenderState(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_downshift_Downshift$RenderState)))
}
function $asArrayOf_Lorg_rebeam_downshift_Downshift$RenderState(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_downshift_Downshift$RenderState(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.downshift.Downshift$RenderState;", depth))
}
var $d_Lorg_rebeam_downshift_Downshift$RenderState = new $TypeData().initClass({
  Lorg_rebeam_downshift_Downshift$RenderState: 0
}, false, "org.rebeam.downshift.Downshift$RenderState", {
  Lorg_rebeam_downshift_Downshift$RenderState: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_downshift_Downshift$RenderState.prototype.$classData = $d_Lorg_rebeam_downshift_Downshift$RenderState;
/** @constructor */
function $c_Lorg_rebeam_mui_styles_Style() {
  $c_O.call(this);
  this.o$1 = null
}
$c_Lorg_rebeam_mui_styles_Style.prototype = new $h_O();
$c_Lorg_rebeam_mui_styles_Style.prototype.constructor = $c_Lorg_rebeam_mui_styles_Style;
/** @constructor */
function $h_Lorg_rebeam_mui_styles_Style() {
  /*<skip>*/
}
$h_Lorg_rebeam_mui_styles_Style.prototype = $c_Lorg_rebeam_mui_styles_Style.prototype;
$c_Lorg_rebeam_mui_styles_Style.prototype.productPrefix__T = (function() {
  return "Style"
});
$c_Lorg_rebeam_mui_styles_Style.prototype.productArity__I = (function() {
  return 1
});
$c_Lorg_rebeam_mui_styles_Style.prototype.equals__O__Z = (function(x$1) {
  return $m_Lorg_rebeam_mui_styles_Style$().equals$extension__sjs_js_Object__O__Z(this.o$1, x$1)
});
$c_Lorg_rebeam_mui_styles_Style.prototype.productElement__I__O = (function(x$1) {
  return $m_Lorg_rebeam_mui_styles_Style$().productElement$extension__sjs_js_Object__I__O(this.o$1, x$1)
});
$c_Lorg_rebeam_mui_styles_Style.prototype.toString__T = (function() {
  return $m_Lorg_rebeam_mui_styles_Style$().toString$extension__sjs_js_Object__T(this.o$1)
});
$c_Lorg_rebeam_mui_styles_Style.prototype.init___sjs_js_Object = (function(o) {
  this.o$1 = o;
  return this
});
$c_Lorg_rebeam_mui_styles_Style.prototype.hashCode__I = (function() {
  var $$this = this.o$1;
  return $objectHashCode($$this)
});
$c_Lorg_rebeam_mui_styles_Style.prototype.productIterator__sc_Iterator = (function() {
  return $m_Lorg_rebeam_mui_styles_Style$().productIterator$extension__sjs_js_Object__sc_Iterator(this.o$1)
});
function $is_Lorg_rebeam_mui_styles_Style(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lorg_rebeam_mui_styles_Style)))
}
function $as_Lorg_rebeam_mui_styles_Style(obj) {
  return (($is_Lorg_rebeam_mui_styles_Style(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "org.rebeam.mui.styles.Style"))
}
function $isArrayOf_Lorg_rebeam_mui_styles_Style(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lorg_rebeam_mui_styles_Style)))
}
function $asArrayOf_Lorg_rebeam_mui_styles_Style(obj, depth) {
  return (($isArrayOf_Lorg_rebeam_mui_styles_Style(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lorg.rebeam.mui.styles.Style;", depth))
}
var $d_Lorg_rebeam_mui_styles_Style = new $TypeData().initClass({
  Lorg_rebeam_mui_styles_Style: 0
}, false, "org.rebeam.mui.styles.Style", {
  Lorg_rebeam_mui_styles_Style: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lorg_rebeam_mui_styles_Style.prototype.$classData = $d_Lorg_rebeam_mui_styles_Style;
/** @constructor */
function $c_jl_ArithmeticException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ArithmeticException.prototype = new $h_jl_RuntimeException();
$c_jl_ArithmeticException.prototype.constructor = $c_jl_ArithmeticException;
/** @constructor */
function $h_jl_ArithmeticException() {
  /*<skip>*/
}
$h_jl_ArithmeticException.prototype = $c_jl_ArithmeticException.prototype;
$c_jl_ArithmeticException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_ArithmeticException = new $TypeData().initClass({
  jl_ArithmeticException: 0
}, false, "java.lang.ArithmeticException", {
  jl_ArithmeticException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ArithmeticException.prototype.$classData = $d_jl_ArithmeticException;
/** @constructor */
function $c_jl_ClassCastException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ClassCastException.prototype = new $h_jl_RuntimeException();
$c_jl_ClassCastException.prototype.constructor = $c_jl_ClassCastException;
/** @constructor */
function $h_jl_ClassCastException() {
  /*<skip>*/
}
$h_jl_ClassCastException.prototype = $c_jl_ClassCastException.prototype;
$c_jl_ClassCastException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
function $is_jl_ClassCastException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_ClassCastException)))
}
function $as_jl_ClassCastException(obj) {
  return (($is_jl_ClassCastException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.ClassCastException"))
}
function $isArrayOf_jl_ClassCastException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_ClassCastException)))
}
function $asArrayOf_jl_ClassCastException(obj, depth) {
  return (($isArrayOf_jl_ClassCastException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.ClassCastException;", depth))
}
var $d_jl_ClassCastException = new $TypeData().initClass({
  jl_ClassCastException: 0
}, false, "java.lang.ClassCastException", {
  jl_ClassCastException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ClassCastException.prototype.$classData = $d_jl_ClassCastException;
/** @constructor */
function $c_jl_IllegalArgumentException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalArgumentException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalArgumentException.prototype.constructor = $c_jl_IllegalArgumentException;
/** @constructor */
function $h_jl_IllegalArgumentException() {
  /*<skip>*/
}
$h_jl_IllegalArgumentException.prototype = $c_jl_IllegalArgumentException.prototype;
$c_jl_IllegalArgumentException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_IllegalArgumentException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalArgumentException = new $TypeData().initClass({
  jl_IllegalArgumentException: 0
}, false, "java.lang.IllegalArgumentException", {
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalArgumentException.prototype.$classData = $d_jl_IllegalArgumentException;
/** @constructor */
function $c_jl_IllegalStateException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalStateException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalStateException.prototype.constructor = $c_jl_IllegalStateException;
/** @constructor */
function $h_jl_IllegalStateException() {
  /*<skip>*/
}
$h_jl_IllegalStateException.prototype = $c_jl_IllegalStateException.prototype;
$c_jl_IllegalStateException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalStateException = new $TypeData().initClass({
  jl_IllegalStateException: 0
}, false, "java.lang.IllegalStateException", {
  jl_IllegalStateException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalStateException.prototype.$classData = $d_jl_IllegalStateException;
/** @constructor */
function $c_jl_IndexOutOfBoundsException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IndexOutOfBoundsException.prototype = new $h_jl_RuntimeException();
$c_jl_IndexOutOfBoundsException.prototype.constructor = $c_jl_IndexOutOfBoundsException;
/** @constructor */
function $h_jl_IndexOutOfBoundsException() {
  /*<skip>*/
}
$h_jl_IndexOutOfBoundsException.prototype = $c_jl_IndexOutOfBoundsException.prototype;
$c_jl_IndexOutOfBoundsException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IndexOutOfBoundsException = new $TypeData().initClass({
  jl_IndexOutOfBoundsException: 0
}, false, "java.lang.IndexOutOfBoundsException", {
  jl_IndexOutOfBoundsException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IndexOutOfBoundsException.prototype.$classData = $d_jl_IndexOutOfBoundsException;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  $c_Ljava_io_OutputStream.call(this)
}
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype;
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.init___ = (function() {
  return this
});
var $d_jl_JSConsoleBasedPrintStream$DummyOutputStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream$DummyOutputStream", {
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  jl_AutoCloseable: 1,
  Ljava_io_Flushable: 1
});
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $c_jl_NegativeArraySizeException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_NegativeArraySizeException.prototype = new $h_jl_RuntimeException();
$c_jl_NegativeArraySizeException.prototype.constructor = $c_jl_NegativeArraySizeException;
/** @constructor */
function $h_jl_NegativeArraySizeException() {
  /*<skip>*/
}
$h_jl_NegativeArraySizeException.prototype = $c_jl_NegativeArraySizeException.prototype;
$c_jl_NegativeArraySizeException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_jl_NegativeArraySizeException = new $TypeData().initClass({
  jl_NegativeArraySizeException: 0
}, false, "java.lang.NegativeArraySizeException", {
  jl_NegativeArraySizeException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NegativeArraySizeException.prototype.$classData = $d_jl_NegativeArraySizeException;
/** @constructor */
function $c_jl_NullPointerException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_NullPointerException.prototype = new $h_jl_RuntimeException();
$c_jl_NullPointerException.prototype.constructor = $c_jl_NullPointerException;
/** @constructor */
function $h_jl_NullPointerException() {
  /*<skip>*/
}
$h_jl_NullPointerException.prototype = $c_jl_NullPointerException.prototype;
$c_jl_NullPointerException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_jl_NullPointerException = new $TypeData().initClass({
  jl_NullPointerException: 0
}, false, "java.lang.NullPointerException", {
  jl_NullPointerException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NullPointerException.prototype.$classData = $d_jl_NullPointerException;
/** @constructor */
function $c_jl_UnsupportedOperationException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_UnsupportedOperationException.prototype = new $h_jl_RuntimeException();
$c_jl_UnsupportedOperationException.prototype.constructor = $c_jl_UnsupportedOperationException;
/** @constructor */
function $h_jl_UnsupportedOperationException() {
  /*<skip>*/
}
$h_jl_UnsupportedOperationException.prototype = $c_jl_UnsupportedOperationException.prototype;
$c_jl_UnsupportedOperationException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_UnsupportedOperationException = new $TypeData().initClass({
  jl_UnsupportedOperationException: 0
}, false, "java.lang.UnsupportedOperationException", {
  jl_UnsupportedOperationException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_UnsupportedOperationException.prototype.$classData = $d_jl_UnsupportedOperationException;
/** @constructor */
function $c_ju_NoSuchElementException() {
  $c_jl_RuntimeException.call(this)
}
$c_ju_NoSuchElementException.prototype = new $h_jl_RuntimeException();
$c_ju_NoSuchElementException.prototype.constructor = $c_ju_NoSuchElementException;
/** @constructor */
function $h_ju_NoSuchElementException() {
  /*<skip>*/
}
$h_ju_NoSuchElementException.prototype = $c_ju_NoSuchElementException.prototype;
$c_ju_NoSuchElementException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_ju_NoSuchElementException = new $TypeData().initClass({
  ju_NoSuchElementException: 0
}, false, "java.util.NoSuchElementException", {
  ju_NoSuchElementException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_NoSuchElementException.prototype.$classData = $d_ju_NoSuchElementException;
/** @constructor */
function $c_s_MatchError() {
  $c_jl_RuntimeException.call(this);
  this.objString$4 = null;
  this.obj$4 = null;
  this.bitmap$0$4 = false
}
$c_s_MatchError.prototype = new $h_jl_RuntimeException();
$c_s_MatchError.prototype.constructor = $c_s_MatchError;
/** @constructor */
function $h_s_MatchError() {
  /*<skip>*/
}
$h_s_MatchError.prototype = $c_s_MatchError.prototype;
$c_s_MatchError.prototype.objString$lzycompute__p4__T = (function() {
  if ((!this.bitmap$0$4)) {
    this.objString$4 = ((this.obj$4 === null) ? "null" : this.liftedTree1$1__p4__T());
    this.bitmap$0$4 = true
  };
  return this.objString$4
});
$c_s_MatchError.prototype.ofClass$1__p4__T = (function() {
  var this$1 = this.obj$4;
  return ("of class " + $objectGetClass(this$1).getName__T())
});
$c_s_MatchError.prototype.liftedTree1$1__p4__T = (function() {
  try {
    return ((($objectToString(this.obj$4) + " (") + this.ofClass$1__p4__T()) + ")")
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      return ("an instance " + this.ofClass$1__p4__T())
    } else {
      throw e
    }
  }
});
$c_s_MatchError.prototype.getMessage__T = (function() {
  return this.objString__p4__T()
});
$c_s_MatchError.prototype.objString__p4__T = (function() {
  return ((!this.bitmap$0$4) ? this.objString$lzycompute__p4__T() : this.objString$4)
});
$c_s_MatchError.prototype.init___O = (function(obj) {
  this.obj$4 = obj;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_s_MatchError = new $TypeData().initClass({
  s_MatchError: 0
}, false, "scala.MatchError", {
  s_MatchError: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_MatchError.prototype.$classData = $d_s_MatchError;
/** @constructor */
function $c_s_Option() {
  $c_O.call(this)
}
$c_s_Option.prototype = new $h_O();
$c_s_Option.prototype.constructor = $c_s_Option;
/** @constructor */
function $h_s_Option() {
  /*<skip>*/
}
$h_s_Option.prototype = $c_s_Option.prototype;
$c_s_Option.prototype.contains__O__Z = (function(elem) {
  return ((!this.isEmpty__Z()) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.get__O(), elem))
});
function $is_s_Option(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Option)))
}
function $as_s_Option(obj) {
  return (($is_s_Option(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Option"))
}
function $isArrayOf_s_Option(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Option)))
}
function $asArrayOf_s_Option(obj, depth) {
  return (($isArrayOf_s_Option(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Option;", depth))
}
function $f_s_math_Ordering__gteq__O__O__Z($thiz, x, y) {
  return ($thiz.compare__O__O__I(x, y) >= 0)
}
function $f_s_math_Ordering__lteq__O__O__Z($thiz, x, y) {
  return ($thiz.compare__O__O__I(x, y) <= 0)
}
/** @constructor */
function $c_s_util_Try() {
  $c_O.call(this)
}
$c_s_util_Try.prototype = new $h_O();
$c_s_util_Try.prototype.constructor = $c_s_util_Try;
/** @constructor */
function $h_s_util_Try() {
  /*<skip>*/
}
$h_s_util_Try.prototype = $c_s_util_Try.prototype;
/** @constructor */
function $c_s_util_control_BreakControl() {
  $c_jl_Throwable.call(this)
}
$c_s_util_control_BreakControl.prototype = new $h_jl_Throwable();
$c_s_util_control_BreakControl.prototype.constructor = $c_s_util_control_BreakControl;
/** @constructor */
function $h_s_util_control_BreakControl() {
  /*<skip>*/
}
$h_s_util_control_BreakControl.prototype = $c_s_util_control_BreakControl.prototype;
$c_s_util_control_BreakControl.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_s_util_control_BreakControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $f_s_util_control_NoStackTrace__fillInStackTrace__jl_Throwable(this)
});
var $d_s_util_control_BreakControl = new $TypeData().initClass({
  s_util_control_BreakControl: 0
}, false, "scala.util.control.BreakControl", {
  s_util_control_BreakControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_s_util_control_BreakControl.prototype.$classData = $d_s_util_control_BreakControl;
function $f_sc_GenMapLike__equals__O__Z($thiz, that) {
  if ($is_sc_GenMap(that)) {
    var x2 = $as_sc_GenMap(that);
    return (($thiz === x2) || (($f_sc_TraversableOnce__size__I($thiz) === $f_sc_TraversableOnce__size__I(x2)) && $f_sc_GenMapLike__liftedTree1$1__psc_GenMapLike__sc_GenMap__Z($thiz, x2)))
  } else {
    return false
  }
}
function $f_sc_GenMapLike__liftedTree1$1__psc_GenMapLike__sc_GenMap__Z($thiz, x2$1) {
  try {
    var this$1 = new $c_sjs_js_WrappedDictionary$DictionaryIterator().init___sjs_js_Dictionary($thiz.dict$5);
    var res = true;
    while ((res && this$1.hasNext__Z())) {
      var arg1 = this$1.next__T2();
      if ((arg1 === null)) {
        throw new $c_s_MatchError().init___O(arg1)
      };
      var k = arg1.$$und1$f;
      var v = arg1.$$und2$f;
      var x1$2 = x2$1.get__T__s_Option($as_T(k));
      matchEnd6: {
        if ($is_s_Some(x1$2)) {
          var x2 = $as_s_Some(x1$2);
          var p3 = x2.value$2;
          if ($m_sr_BoxesRunTime$().equals__O__O__Z(v, p3)) {
            res = true;
            break matchEnd6
          }
        };
        res = false
      }
    };
    return res
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      return false
    } else {
      throw e
    }
  }
}
function $f_sc_GenSeqLike__equals__O__Z($thiz, that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return $thiz.sameElements__sc_GenIterable__Z(x2)
  } else {
    return false
  }
}
function $is_sc_GenTraversable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversable)))
}
function $as_sc_GenTraversable(obj) {
  return (($is_sc_GenTraversable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversable"))
}
function $isArrayOf_sc_GenTraversable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversable)))
}
function $asArrayOf_sc_GenTraversable(obj, depth) {
  return (($isArrayOf_sc_GenTraversable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversable;", depth))
}
/** @constructor */
function $c_sc_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sc_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Iterable$.prototype.constructor = $c_sc_Iterable$;
/** @constructor */
function $h_sc_Iterable$() {
  /*<skip>*/
}
$h_sc_Iterable$.prototype = $c_sc_Iterable$.prototype;
$c_sc_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sc_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Iterable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Iterable$ = new $TypeData().initClass({
  sc_Iterable$: 0
}, false, "scala.collection.Iterable$", {
  sc_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Iterable$.prototype.$classData = $d_sc_Iterable$;
var $n_sc_Iterable$ = (void 0);
function $m_sc_Iterable$() {
  if ((!$n_sc_Iterable$)) {
    $n_sc_Iterable$ = new $c_sc_Iterable$().init___()
  };
  return $n_sc_Iterable$
}
/** @constructor */
function $c_sc_Iterator$$anon$10() {
  $c_sc_AbstractIterator.call(this);
  this.$$outer$2 = null;
  this.f$1$2 = null
}
$c_sc_Iterator$$anon$10.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$10.prototype.constructor = $c_sc_Iterator$$anon$10;
/** @constructor */
function $h_sc_Iterator$$anon$10() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$10.prototype = $c_sc_Iterator$$anon$10.prototype;
$c_sc_Iterator$$anon$10.prototype.next__O = (function() {
  return this.f$1$2.apply__O__O(this.$$outer$2.next__O())
});
$c_sc_Iterator$$anon$10.prototype.init___sc_Iterator__F1 = (function($$outer, f$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$1$2 = f$1;
  return this
});
$c_sc_Iterator$$anon$10.prototype.hasNext__Z = (function() {
  return this.$$outer$2.hasNext__Z()
});
var $d_sc_Iterator$$anon$10 = new $TypeData().initClass({
  sc_Iterator$$anon$10: 0
}, false, "scala.collection.Iterator$$anon$10", {
  sc_Iterator$$anon$10: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$10.prototype.$classData = $d_sc_Iterator$$anon$10;
/** @constructor */
function $c_sc_Iterator$$anon$12() {
  $c_sc_AbstractIterator.call(this);
  this.hd$2 = null;
  this.hdDefined$2 = false;
  this.$$outer$2 = null;
  this.p$1$2 = null
}
$c_sc_Iterator$$anon$12.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$12.prototype.constructor = $c_sc_Iterator$$anon$12;
/** @constructor */
function $h_sc_Iterator$$anon$12() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$12.prototype = $c_sc_Iterator$$anon$12.prototype;
$c_sc_Iterator$$anon$12.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    this.hdDefined$2 = false;
    return this.hd$2
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_Iterator$$anon$12.prototype.init___sc_Iterator__F1 = (function($$outer, p$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.p$1$2 = p$1;
  this.hdDefined$2 = false;
  return this
});
$c_sc_Iterator$$anon$12.prototype.hasNext__Z = (function() {
  if (this.hdDefined$2) {
    return true
  } else {
    do {
      if ((!this.$$outer$2.hasNext__Z())) {
        return false
      };
      this.hd$2 = this.$$outer$2.next__O()
    } while ((!$uZ(this.p$1$2.apply__O__O(this.hd$2))));
    this.hdDefined$2 = true;
    return true
  }
});
var $d_sc_Iterator$$anon$12 = new $TypeData().initClass({
  sc_Iterator$$anon$12: 0
}, false, "scala.collection.Iterator$$anon$12", {
  sc_Iterator$$anon$12: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$12.prototype.$classData = $d_sc_Iterator$$anon$12;
/** @constructor */
function $c_sc_Iterator$$anon$2() {
  $c_sc_AbstractIterator.call(this)
}
$c_sc_Iterator$$anon$2.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$2.prototype.constructor = $c_sc_Iterator$$anon$2;
/** @constructor */
function $h_sc_Iterator$$anon$2() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$2.prototype = $c_sc_Iterator$$anon$2.prototype;
$c_sc_Iterator$$anon$2.prototype.init___ = (function() {
  return this
});
$c_sc_Iterator$$anon$2.prototype.next__O = (function() {
  this.next__sr_Nothing$()
});
$c_sc_Iterator$$anon$2.prototype.next__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
});
$c_sc_Iterator$$anon$2.prototype.hasNext__Z = (function() {
  return false
});
var $d_sc_Iterator$$anon$2 = new $TypeData().initClass({
  sc_Iterator$$anon$2: 0
}, false, "scala.collection.Iterator$$anon$2", {
  sc_Iterator$$anon$2: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$2.prototype.$classData = $d_sc_Iterator$$anon$2;
/** @constructor */
function $c_sc_LinearSeqLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sc_LinearSeqLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_LinearSeqLike$$anon$1.prototype.constructor = $c_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $h_sc_LinearSeqLike$$anon$1() {
  /*<skip>*/
}
$h_sc_LinearSeqLike$$anon$1.prototype = $c_sc_LinearSeqLike$$anon$1.prototype;
$c_sc_LinearSeqLike$$anon$1.prototype.init___sc_LinearSeqLike = (function($$outer) {
  this.these$2 = $$outer;
  return this
});
$c_sc_LinearSeqLike$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    var result = this.these$2.head__O();
    this.these$2 = $as_sc_LinearSeqLike(this.these$2.tail__O());
    return result
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_LinearSeqLike$$anon$1.prototype.hasNext__Z = (function() {
  return (!this.these$2.isEmpty__Z())
});
var $d_sc_LinearSeqLike$$anon$1 = new $TypeData().initClass({
  sc_LinearSeqLike$$anon$1: 0
}, false, "scala.collection.LinearSeqLike$$anon$1", {
  sc_LinearSeqLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_LinearSeqLike$$anon$1.prototype.$classData = $d_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $c_sc_Traversable$() {
  $c_scg_GenTraversableFactory.call(this);
  this.breaks$3 = null
}
$c_sc_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Traversable$.prototype.constructor = $c_sc_Traversable$;
/** @constructor */
function $h_sc_Traversable$() {
  /*<skip>*/
}
$h_sc_Traversable$.prototype = $c_sc_Traversable$.prototype;
$c_sc_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_Traversable$ = this;
  this.breaks$3 = new $c_s_util_control_Breaks().init___();
  return this
});
$c_sc_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Traversable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Traversable$ = new $TypeData().initClass({
  sc_Traversable$: 0
}, false, "scala.collection.Traversable$", {
  sc_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Traversable$.prototype.$classData = $d_sc_Traversable$;
var $n_sc_Traversable$ = (void 0);
function $m_sc_Traversable$() {
  if ((!$n_sc_Traversable$)) {
    $n_sc_Traversable$ = new $c_sc_Traversable$().init___()
  };
  return $n_sc_Traversable$
}
/** @constructor */
function $c_sci_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Iterable$.prototype.constructor = $c_sci_Iterable$;
/** @constructor */
function $h_sci_Iterable$() {
  /*<skip>*/
}
$h_sci_Iterable$.prototype = $c_sci_Iterable$.prototype;
$c_sci_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Iterable$ = new $TypeData().initClass({
  sci_Iterable$: 0
}, false, "scala.collection.immutable.Iterable$", {
  sci_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Iterable$.prototype.$classData = $d_sci_Iterable$;
var $n_sci_Iterable$ = (void 0);
function $m_sci_Iterable$() {
  if ((!$n_sci_Iterable$)) {
    $n_sci_Iterable$ = new $c_sci_Iterable$().init___()
  };
  return $n_sci_Iterable$
}
/** @constructor */
function $c_sci_StreamIterator() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sci_StreamIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_StreamIterator.prototype.constructor = $c_sci_StreamIterator;
/** @constructor */
function $h_sci_StreamIterator() {
  /*<skip>*/
}
$h_sci_StreamIterator.prototype = $c_sci_StreamIterator.prototype;
$c_sci_StreamIterator.prototype.next__O = (function() {
  if ($f_sc_Iterator__isEmpty__Z(this)) {
    return $m_sc_Iterator$().empty$1.next__O()
  } else {
    var cur = this.these$2.v__sci_Stream();
    var result = cur.head__O();
    this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, cur$1) {
      return (function() {
        return $as_sci_Stream(cur$1.tail__O())
      })
    })(this, cur)));
    return result
  }
});
$c_sci_StreamIterator.prototype.init___sci_Stream = (function(self) {
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, self$1) {
    return (function() {
      return self$1
    })
  })(this, self)));
  return this
});
$c_sci_StreamIterator.prototype.hasNext__Z = (function() {
  var this$1 = this.these$2.v__sci_Stream();
  return $f_sc_TraversableOnce__nonEmpty__Z(this$1)
});
$c_sci_StreamIterator.prototype.toStream__sci_Stream = (function() {
  var result = this.these$2.v__sci_Stream();
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      $m_sci_Stream$();
      return $m_sci_Stream$Empty$()
    })
  })(this)));
  return result
});
var $d_sci_StreamIterator = new $TypeData().initClass({
  sci_StreamIterator: 0
}, false, "scala.collection.immutable.StreamIterator", {
  sci_StreamIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_StreamIterator.prototype.$classData = $d_sci_StreamIterator;
/** @constructor */
function $c_sci_StringLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.str$2 = null;
  this.len$2 = 0;
  this.index$2 = 0;
  this.$$outer$2 = null
}
$c_sci_StringLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_StringLike$$anon$1.prototype.constructor = $c_sci_StringLike$$anon$1;
/** @constructor */
function $h_sci_StringLike$$anon$1() {
  /*<skip>*/
}
$h_sci_StringLike$$anon$1.prototype = $c_sci_StringLike$$anon$1.prototype;
$c_sci_StringLike$$anon$1.prototype.next__O = (function() {
  return this.next__T()
});
$c_sci_StringLike$$anon$1.prototype.next__T = (function() {
  if ((this.index$2 >= this.len$2)) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
  };
  var start = this.index$2;
  while (true) {
    if ((this.index$2 < this.len$2)) {
      var this$1 = this.$$outer$2;
      var c = this.$$outer$2.apply__I__C(this.index$2);
      var jsx$1 = (!$f_sci_StringLike__scala$collection$immutable$StringLike$$isLineBreak__C__Z(this$1, c))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      this.index$2 = ((1 + this.index$2) | 0)
    } else {
      break
    }
  };
  this.index$2 = ((1 + this.index$2) | 0);
  var thiz = this.str$2;
  var x = this.index$2;
  var that = this.len$2;
  var endIndex = ((x < that) ? x : that);
  return $as_T(thiz.substring(start, endIndex))
});
$c_sci_StringLike$$anon$1.prototype.hasNext__Z = (function() {
  return (this.index$2 < this.len$2)
});
$c_sci_StringLike$$anon$1.prototype.init___sci_StringLike = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.str$2 = $$outer.toString__T();
  var thiz = this.str$2;
  this.len$2 = $uI(thiz.length);
  this.index$2 = 0;
  return this
});
var $d_sci_StringLike$$anon$1 = new $TypeData().initClass({
  sci_StringLike$$anon$1: 0
}, false, "scala.collection.immutable.StringLike$$anon$1", {
  sci_StringLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_StringLike$$anon$1.prototype.$classData = $d_sci_StringLike$$anon$1;
/** @constructor */
function $c_sci_Traversable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Traversable$.prototype.constructor = $c_sci_Traversable$;
/** @constructor */
function $h_sci_Traversable$() {
  /*<skip>*/
}
$h_sci_Traversable$.prototype = $c_sci_Traversable$.prototype;
$c_sci_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Traversable$ = new $TypeData().initClass({
  sci_Traversable$: 0
}, false, "scala.collection.immutable.Traversable$", {
  sci_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Traversable$.prototype.$classData = $d_sci_Traversable$;
var $n_sci_Traversable$ = (void 0);
function $m_sci_Traversable$() {
  if ((!$n_sci_Traversable$)) {
    $n_sci_Traversable$ = new $c_sci_Traversable$().init___()
  };
  return $n_sci_Traversable$
}
/** @constructor */
function $c_scm_Builder$$anon$1() {
  $c_O.call(this);
  this.self$1 = null;
  this.f$1$1 = null
}
$c_scm_Builder$$anon$1.prototype = new $h_O();
$c_scm_Builder$$anon$1.prototype.constructor = $c_scm_Builder$$anon$1;
/** @constructor */
function $h_scm_Builder$$anon$1() {
  /*<skip>*/
}
$h_scm_Builder$$anon$1.prototype = $c_scm_Builder$$anon$1.prototype;
$c_scm_Builder$$anon$1.prototype.init___scm_Builder__F1 = (function($$outer, f$1) {
  this.f$1$1 = f$1;
  this.self$1 = $$outer;
  return this
});
$c_scm_Builder$$anon$1.prototype.equals__O__Z = (function(that) {
  return $f_s_Proxy__equals__O__Z(this, that)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.toString__T = (function() {
  return $f_s_Proxy__toString__T(this)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1 = (function(xs) {
  this.self$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(xs);
  return this
});
$c_scm_Builder$$anon$1.prototype.result__O = (function() {
  return this.f$1$1.apply__O__O(this.self$1.result__O())
});
$c_scm_Builder$$anon$1.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundColl) {
  this.self$1.sizeHintBounded__I__sc_TraversableLike__V(size, boundColl)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder$$anon$1 = (function(x) {
  this.self$1.$$plus$eq__O__scm_Builder(x);
  return this
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.hashCode__I = (function() {
  return this.self$1.hashCode__I()
});
$c_scm_Builder$$anon$1.prototype.sizeHint__I__V = (function(size) {
  this.self$1.sizeHint__I__V(size)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1(xs)
});
var $d_scm_Builder$$anon$1 = new $TypeData().initClass({
  scm_Builder$$anon$1: 0
}, false, "scala.collection.mutable.Builder$$anon$1", {
  scm_Builder$$anon$1: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Proxy: 1
});
$c_scm_Builder$$anon$1.prototype.$classData = $d_scm_Builder$$anon$1;
/** @constructor */
function $c_scm_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scm_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_scm_Iterable$.prototype.constructor = $c_scm_Iterable$;
/** @constructor */
function $h_scm_Iterable$() {
  /*<skip>*/
}
$h_scm_Iterable$.prototype = $c_scm_Iterable$.prototype;
$c_scm_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_Iterable$ = new $TypeData().initClass({
  scm_Iterable$: 0
}, false, "scala.collection.mutable.Iterable$", {
  scm_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_Iterable$.prototype.$classData = $d_scm_Iterable$;
var $n_scm_Iterable$ = (void 0);
function $m_scm_Iterable$() {
  if ((!$n_scm_Iterable$)) {
    $n_scm_Iterable$ = new $c_scm_Iterable$().init___()
  };
  return $n_scm_Iterable$
}
/** @constructor */
function $c_scm_LazyBuilder() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_scm_LazyBuilder.prototype = new $h_O();
$c_scm_LazyBuilder.prototype.constructor = $c_scm_LazyBuilder;
/** @constructor */
function $h_scm_LazyBuilder() {
  /*<skip>*/
}
$h_scm_LazyBuilder.prototype = $c_scm_LazyBuilder.prototype;
$c_scm_LazyBuilder.prototype.init___ = (function() {
  this.parts$1 = new $c_scm_ListBuffer().init___();
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder = (function(xs) {
  this.parts$1.$$plus$eq__O__scm_ListBuffer(xs);
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_LazyBuilder = (function(x) {
  var jsx$1 = this.parts$1;
  $m_sci_List$();
  var array = [x];
  var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array(array);
  var this$4 = $m_sci_List$();
  var cbf = this$4.ReusableCBFInstance$2;
  jsx$1.$$plus$eq__O__scm_ListBuffer($as_sci_List($f_sc_TraversableLike__to__scg_CanBuildFrom__O(xs, cbf)));
  return this
});
$c_scm_LazyBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder(xs)
});
/** @constructor */
function $c_scm_ListBuffer$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.cursor$2 = null
}
$c_scm_ListBuffer$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_ListBuffer$$anon$1.prototype.constructor = $c_scm_ListBuffer$$anon$1;
/** @constructor */
function $h_scm_ListBuffer$$anon$1() {
  /*<skip>*/
}
$h_scm_ListBuffer$$anon$1.prototype = $c_scm_ListBuffer$$anon$1.prototype;
$c_scm_ListBuffer$$anon$1.prototype.init___scm_ListBuffer = (function($$outer) {
  this.cursor$2 = ($$outer.isEmpty__Z() ? $m_sci_Nil$() : $$outer.scala$collection$mutable$ListBuffer$$start$6);
  return this
});
$c_scm_ListBuffer$$anon$1.prototype.next__O = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty Iterator")
  } else {
    var ans = this.cursor$2.head__O();
    var this$1 = this.cursor$2;
    this.cursor$2 = this$1.tail__sci_List();
    return ans
  }
});
$c_scm_ListBuffer$$anon$1.prototype.hasNext__Z = (function() {
  return (this.cursor$2 !== $m_sci_Nil$())
});
var $d_scm_ListBuffer$$anon$1 = new $TypeData().initClass({
  scm_ListBuffer$$anon$1: 0
}, false, "scala.collection.mutable.ListBuffer$$anon$1", {
  scm_ListBuffer$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_ListBuffer$$anon$1.prototype.$classData = $d_scm_ListBuffer$$anon$1;
/** @constructor */
function $c_sr_ScalaRunTime$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.c$2 = 0;
  this.cmax$2 = 0;
  this.x$2$2 = null
}
$c_sr_ScalaRunTime$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sr_ScalaRunTime$$anon$1.prototype.constructor = $c_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $h_sr_ScalaRunTime$$anon$1() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$$anon$1.prototype = $c_sr_ScalaRunTime$$anon$1.prototype;
$c_sr_ScalaRunTime$$anon$1.prototype.next__O = (function() {
  var result = this.x$2$2.productElement__I__O(this.c$2);
  this.c$2 = ((1 + this.c$2) | 0);
  return result
});
$c_sr_ScalaRunTime$$anon$1.prototype.init___s_Product = (function(x$2) {
  this.x$2$2 = x$2;
  this.c$2 = 0;
  this.cmax$2 = x$2.productArity__I();
  return this
});
$c_sr_ScalaRunTime$$anon$1.prototype.hasNext__Z = (function() {
  return (this.c$2 < this.cmax$2)
});
var $d_sr_ScalaRunTime$$anon$1 = new $TypeData().initClass({
  sr_ScalaRunTime$$anon$1: 0
}, false, "scala.runtime.ScalaRunTime$$anon$1", {
  sr_ScalaRunTime$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sr_ScalaRunTime$$anon$1.prototype.$classData = $d_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Js$$anon$3() {
  $c_O.call(this);
  this.raw$1 = null;
  this.mountRaw$1 = null;
  this.vdomElement$1 = null
}
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Js$$anon$3;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Js$$anon$3() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype = $c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype;
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement = (function() {
  return this.vdomElement$1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.mountRaw__F1 = (function() {
  return this.mountRaw$1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.raw__Ljapgolly_scalajs_react_raw_React$ComponentElement = (function() {
  return this.raw$1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.mapMounted__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(f) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var mp = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$4().init___Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot__F1__F1(this, mp, f)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.mapUnmountedProps__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(f) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var mm = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$4().init___Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot__F1__F1(this, f, mm)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.init___Ljapgolly_scalajs_react_raw_React$ComponentElement__F1 = (function(r$1, m$1) {
  this.raw$1 = r$1;
  this.mountRaw$1 = m$1;
  var n = this.raw$1;
  this.vdomElement$1 = new $c_Ljapgolly_scalajs_react_vdom_VdomElement().init___Ljapgolly_scalajs_react_raw_React$Element(n);
  return this
});
var $d_Ljapgolly_scalajs_react_component_Js$$anon$3 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Js$$anon$3: 0
}, false, "japgolly.scalajs.react.component.Js$$anon$3", {
  Ljapgolly_scalajs_react_component_Js$$anon$3: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Js$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedRaw: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot: 1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$3.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Js$$anon$3;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Js$$anon$4() {
  $c_O.call(this);
  this.raw$1 = null;
  this.mountRaw$1 = null;
  this.from$1$1 = null;
  this.mp$1$1 = null;
  this.mm$1$1 = null
}
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Js$$anon$4;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Js$$anon$4() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype = $c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype;
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement = (function() {
  return this.from$1$1.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement()
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.mountRaw__F1 = (function() {
  return this.mountRaw$1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.raw__Ljapgolly_scalajs_react_raw_React$ComponentElement = (function() {
  return this.raw$1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.mapMounted__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(f) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var from = this.from$1$1;
  var mp = this.mp$1$1;
  var g = this.mm$1$1;
  var mm = $f_F1__compose__F1__F1(f, g);
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$4().init___Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot__F1__F1(from, mp, mm)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.init___Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot__F1__F1 = (function(from$1, mp$1, mm$1) {
  this.from$1$1 = from$1;
  this.mp$1$1 = mp$1;
  this.mm$1$1 = mm$1;
  this.raw$1 = from$1.raw__Ljapgolly_scalajs_react_raw_React$ComponentElement();
  var g = from$1.mountRaw__F1();
  this.mountRaw$1 = $f_F1__compose__F1__F1(mm$1, g);
  return this
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.mapUnmountedProps__F1__Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot = (function(f) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var from = this.from$1$1;
  var g = this.mp$1$1;
  var mp = $f_F1__compose__F1__F1(f, g);
  var mm = this.mm$1$1;
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$4().init___Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot__F1__F1(from, mp, mm)
});
var $d_Ljapgolly_scalajs_react_component_Js$$anon$4 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Js$$anon$4: 0
}, false, "japgolly.scalajs.react.component.Js$$anon$4", {
  Ljapgolly_scalajs_react_component_Js$$anon$4: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Js$UnmountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Js$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedRaw: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot: 1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$4.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Js$$anon$4;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1() {
  $c_O.call(this);
  this.raw$1 = null;
  this.ctor$1 = null;
  this.$$outer$1 = null;
  this.pf$1$1 = null
}
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype = $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__sjs_js_Any__Ljapgolly_scalajs_react_CtorType__Ljapgolly_scalajs_react_internal_Profunctor = (function($$outer, rc$1, c$1, pf$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  this.pf$1$1 = pf$1;
  this.raw$1 = rc$1;
  this.ctor$1 = c$1;
  return this
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.ctor__Ljapgolly_scalajs_react_CtorType = (function() {
  return this.ctor$1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.raw__sjs_js_Any = (function() {
  return this.raw$1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.cmapCtorProps__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(f) {
  var this$1 = this.$$outer$1;
  var mc = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  var mu = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  var pf = this.pf$1$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot__F1__F1__F1__Ljapgolly_scalajs_react_internal_Profunctor(this$1, this, f, mc, mu, pf)
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.mapUnmounted__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(f) {
  var this$1 = this.$$outer$1;
  var cp = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  var mc = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  var pf = this.pf$1$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot__F1__F1__F1__Ljapgolly_scalajs_react_internal_Profunctor(this$1, this, cp, mc, f, pf)
});
var $d_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1: 0
}, false, "japgolly.scalajs.react.component.JsBaseComponentTemplate$$anon$1", {
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentRaw: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentWithRoot: 1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2() {
  $c_O.call(this);
  this.raw$1 = null;
  this.ctor$1 = null;
  this.$$outer$1 = null;
  this.from$1$1 = null;
  this.cp$1$1 = null;
  this.mc$1$1 = null;
  this.mu$1$1 = null;
  this.pf$2$1 = null
}
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.constructor = $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype = $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype;
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.ctor__Ljapgolly_scalajs_react_CtorType = (function() {
  return this.ctor$1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.raw__sjs_js_Any = (function() {
  return this.raw$1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.cmapCtorProps__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(f) {
  var this$2 = this.$$outer$1;
  var from = this.from$1$1;
  var this$1 = this.cp$1$1;
  var cp = $f_F1__compose__F1__F1(this$1, f);
  var mc = this.mc$1$1;
  var mu = this.mu$1$1;
  var pf = this.pf$2$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot__F1__F1__F1__Ljapgolly_scalajs_react_internal_Profunctor(this$2, from, cp, mc, mu, pf)
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot__F1__F1__F1__Ljapgolly_scalajs_react_internal_Profunctor = (function($$outer, from$1, cp$1, mc$1, mu$1, pf$2) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  this.from$1$1 = from$1;
  this.cp$1$1 = cp$1;
  this.mc$1$1 = mc$1;
  this.mu$1$1 = mu$1;
  this.pf$2$1 = pf$2;
  this.raw$1 = from$1.raw__sjs_js_Any();
  $m_Ljapgolly_scalajs_react_internal_package$();
  var f = mc$1.apply__O__O(from$1.ctor__Ljapgolly_scalajs_react_CtorType());
  var p = this.pf$2$1;
  this.ctor$1 = $as_Ljapgolly_scalajs_react_CtorType(new $c_Ljapgolly_scalajs_react_internal_Profunctor$Ops().init___O__Ljapgolly_scalajs_react_internal_Profunctor(f, p).dimap__F1__F1__O(cp$1, mu$1));
  return this
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.mapUnmounted__F1__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot = (function(f) {
  var this$1 = this.$$outer$1;
  var from = this.from$1$1;
  var cp = this.cp$1$1;
  var mc = this.mc$1$1;
  var g = this.mu$1$1;
  var mu = $f_F1__compose__F1__F1(f, g);
  var pf = this.pf$2$1;
  return new $c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2().init___Ljapgolly_scalajs_react_component_JsBaseComponentTemplate__Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot__F1__F1__F1__Ljapgolly_scalajs_react_internal_Profunctor(this$1, from, cp, mc, mu, pf)
});
var $d_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2: 0
}, false, "japgolly.scalajs.react.component.JsBaseComponentTemplate$$anon$2", {
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentWithRoot: 1,
  Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$ComponentSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentRaw: 1,
  Ljapgolly_scalajs_react_component_Generic$ComponentWithRoot: 1
});
$c_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2.prototype.$classData = $d_Ljapgolly_scalajs_react_component_JsBaseComponentTemplate$$anon$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_JsFn$$anon$1() {
  $c_O.call(this);
  this.raw$1 = null;
  this.mountRaw$1 = null;
  this.vdomElement$1 = null
}
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_component_JsFn$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_JsFn$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype = $c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.vdomElement__Ljapgolly_scalajs_react_vdom_VdomElement = (function() {
  return this.vdomElement$1
});
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.mountRaw__F1 = (function() {
  return this.mountRaw$1
});
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.raw__Ljapgolly_scalajs_react_raw_React$ComponentElement = (function() {
  return this.raw$1
});
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.init___Ljapgolly_scalajs_react_raw_React$ComponentElement = (function(r$1) {
  this.raw$1 = r$1;
  this.mountRaw$1 = $m_Ljapgolly_scalajs_react_component_JsFn$().japgolly$scalajs$react$component$JsFn$$constUnit$1;
  var n = this.raw$1;
  this.vdomElement$1 = new $c_Ljapgolly_scalajs_react_vdom_VdomElement().init___Ljapgolly_scalajs_react_raw_React$Element(n);
  return this
});
var $d_Ljapgolly_scalajs_react_component_JsFn$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_JsFn$$anon$1: 0
}, false, "japgolly.scalajs.react.component.JsFn$$anon$1", {
  Ljapgolly_scalajs_react_component_JsFn$$anon$1: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_JsFn$UnmountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_JsFn$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedRaw: 1,
  Ljapgolly_scalajs_react_component_Generic$UnmountedWithRoot: 1
});
$c_Ljapgolly_scalajs_react_component_JsFn$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_component_JsFn$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_TagMod$Composite() {
  $c_O.call(this);
  this.mods$1 = null
}
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_TagMod$Composite;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_TagMod$Composite() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype = $c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype;
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.productPrefix__T = (function() {
  return "Composite"
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.productArity__I = (function() {
  return 1
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Ljapgolly_scalajs_react_vdom_TagMod$Composite(x$1)) {
    var Composite$1 = $as_Ljapgolly_scalajs_react_vdom_TagMod$Composite(x$1);
    var x = this.mods$1;
    var x$2 = Composite$1.mods$1;
    return ((x === null) ? (x$2 === null) : $f_sc_GenSeqLike__equals__O__Z(x, x$2))
  } else {
    return false
  }
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.mods$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.init___sci_Vector = (function(mods) {
  this.mods$1 = mods;
  return this
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V = (function(b) {
  var this$1 = this.mods$1;
  var this$2 = this$1.iterator__sci_VectorIterator();
  while (this$2.$$undhasNext$2) {
    var arg1 = this$2.next__O();
    var x$1 = $as_Ljapgolly_scalajs_react_vdom_TagMod(arg1);
    x$1.applyTo__Ljapgolly_scalajs_react_vdom_Builder__V(b)
  }
});
function $is_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_vdom_TagMod$Composite)))
}
function $as_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj) {
  return (($is_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.vdom.TagMod$Composite"))
}
function $isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_vdom_TagMod$Composite)))
}
function $asArrayOf_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_vdom_TagMod$Composite(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.vdom.TagMod$Composite;", depth))
}
var $d_Ljapgolly_scalajs_react_vdom_TagMod$Composite = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_TagMod$Composite: 0
}, false, "japgolly.scalajs.react.vdom.TagMod$Composite", {
  Ljapgolly_scalajs_react_vdom_TagMod$Composite: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_TagMod: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Ljapgolly_scalajs_react_vdom_TagMod$Composite.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_TagMod$Composite;
/** @constructor */
function $c_Lsourcecode_FullName() {
  $c_Lsourcecode_SourceValue.call(this);
  this.value$2 = null
}
$c_Lsourcecode_FullName.prototype = new $h_Lsourcecode_SourceValue();
$c_Lsourcecode_FullName.prototype.constructor = $c_Lsourcecode_FullName;
/** @constructor */
function $h_Lsourcecode_FullName() {
  /*<skip>*/
}
$h_Lsourcecode_FullName.prototype = $c_Lsourcecode_FullName.prototype;
$c_Lsourcecode_FullName.prototype.productPrefix__T = (function() {
  return "FullName"
});
$c_Lsourcecode_FullName.prototype.productArity__I = (function() {
  return 1
});
$c_Lsourcecode_FullName.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lsourcecode_FullName(x$1)) {
    var FullName$1 = $as_Lsourcecode_FullName(x$1);
    return (this.value$2 === FullName$1.value$2)
  } else {
    return false
  }
});
$c_Lsourcecode_FullName.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lsourcecode_FullName.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lsourcecode_FullName.prototype.init___T = (function(value) {
  this.value$2 = value;
  return this
});
$c_Lsourcecode_FullName.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lsourcecode_FullName.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lsourcecode_FullName(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lsourcecode_FullName)))
}
function $as_Lsourcecode_FullName(obj) {
  return (($is_Lsourcecode_FullName(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "sourcecode.FullName"))
}
function $isArrayOf_Lsourcecode_FullName(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lsourcecode_FullName)))
}
function $asArrayOf_Lsourcecode_FullName(obj, depth) {
  return (($isArrayOf_Lsourcecode_FullName(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lsourcecode.FullName;", depth))
}
var $d_Lsourcecode_FullName = new $TypeData().initClass({
  Lsourcecode_FullName: 0
}, false, "sourcecode.FullName", {
  Lsourcecode_FullName: 1,
  Lsourcecode_SourceValue: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lsourcecode_FullName.prototype.$classData = $d_Lsourcecode_FullName;
/** @constructor */
function $c_Lsourcecode_Line() {
  $c_Lsourcecode_SourceValue.call(this);
  this.value$2 = 0
}
$c_Lsourcecode_Line.prototype = new $h_Lsourcecode_SourceValue();
$c_Lsourcecode_Line.prototype.constructor = $c_Lsourcecode_Line;
/** @constructor */
function $h_Lsourcecode_Line() {
  /*<skip>*/
}
$h_Lsourcecode_Line.prototype = $c_Lsourcecode_Line.prototype;
$c_Lsourcecode_Line.prototype.productPrefix__T = (function() {
  return "Line"
});
$c_Lsourcecode_Line.prototype.productArity__I = (function() {
  return 1
});
$c_Lsourcecode_Line.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lsourcecode_Line(x$1)) {
    var Line$1 = $as_Lsourcecode_Line(x$1);
    return (this.value$2 === Line$1.value$2)
  } else {
    return false
  }
});
$c_Lsourcecode_Line.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lsourcecode_Line.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lsourcecode_Line.prototype.init___I = (function(value) {
  this.value$2 = value;
  return this
});
$c_Lsourcecode_Line.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.value$2);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lsourcecode_Line.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lsourcecode_Line(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lsourcecode_Line)))
}
function $as_Lsourcecode_Line(obj) {
  return (($is_Lsourcecode_Line(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "sourcecode.Line"))
}
function $isArrayOf_Lsourcecode_Line(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lsourcecode_Line)))
}
function $asArrayOf_Lsourcecode_Line(obj, depth) {
  return (($isArrayOf_Lsourcecode_Line(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lsourcecode.Line;", depth))
}
var $d_Lsourcecode_Line = new $TypeData().initClass({
  Lsourcecode_Line: 0
}, false, "sourcecode.Line", {
  Lsourcecode_Line: 1,
  Lsourcecode_SourceValue: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lsourcecode_Line.prototype.$classData = $d_Lsourcecode_Line;
/** @constructor */
function $c_T2() {
  $c_O.call(this);
  this.$$und1$f = null;
  this.$$und2$f = null
}
$c_T2.prototype = new $h_O();
$c_T2.prototype.constructor = $c_T2;
/** @constructor */
function $h_T2() {
  /*<skip>*/
}
$h_T2.prototype = $c_T2.prototype;
$c_T2.prototype.productPrefix__T = (function() {
  return "Tuple2"
});
$c_T2.prototype.productArity__I = (function() {
  return 2
});
$c_T2.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T2(x$1)) {
    var Tuple2$1 = $as_T2(x$1);
    return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$f, Tuple2$1.$$und1$f) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$f, Tuple2$1.$$und2$f))
  } else {
    return false
  }
});
$c_T2.prototype.productElement__I__O = (function(n) {
  return $f_s_Product2__productElement__I__O(this, n)
});
$c_T2.prototype.init___O__O = (function(_1, _2) {
  this.$$und1$f = _1;
  this.$$und2$f = _2;
  return this
});
$c_T2.prototype.toString__T = (function() {
  return (((("(" + this.$$und1$f) + ",") + this.$$und2$f) + ")")
});
$c_T2.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T2.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T2(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T2)))
}
function $as_T2(obj) {
  return (($is_T2(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple2"))
}
function $isArrayOf_T2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T2)))
}
function $asArrayOf_T2(obj, depth) {
  return (($isArrayOf_T2(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple2;", depth))
}
var $d_T2 = new $TypeData().initClass({
  T2: 0
}, false, "scala.Tuple2", {
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T2.prototype.$classData = $d_T2;
/** @constructor */
function $c_T3() {
  $c_O.call(this);
  this.$$und1$1 = null;
  this.$$und2$1 = null;
  this.$$und3$1 = null
}
$c_T3.prototype = new $h_O();
$c_T3.prototype.constructor = $c_T3;
/** @constructor */
function $h_T3() {
  /*<skip>*/
}
$h_T3.prototype = $c_T3.prototype;
$c_T3.prototype.productPrefix__T = (function() {
  return "Tuple3"
});
$c_T3.prototype.productArity__I = (function() {
  return 3
});
$c_T3.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T3(x$1)) {
    var Tuple3$1 = $as_T3(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$1, Tuple3$1.$$und1$1) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$1, Tuple3$1.$$und2$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und3$1, Tuple3$1.$$und3$1))
  } else {
    return false
  }
});
$c_T3.prototype.productElement__I__O = (function(n) {
  return $f_s_Product3__productElement__I__O(this, n)
});
$c_T3.prototype.toString__T = (function() {
  return (((((("(" + this.$$und1$1) + ",") + this.$$und2$1) + ",") + this.$$und3$1) + ")")
});
$c_T3.prototype.init___O__O__O = (function(_1, _2, _3) {
  this.$$und1$1 = _1;
  this.$$und2$1 = _2;
  this.$$und3$1 = _3;
  return this
});
$c_T3.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T3.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T3(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T3)))
}
function $as_T3(obj) {
  return (($is_T3(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple3"))
}
function $isArrayOf_T3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T3)))
}
function $asArrayOf_T3(obj, depth) {
  return (($isArrayOf_T3(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple3;", depth))
}
var $d_T3 = new $TypeData().initClass({
  T3: 0
}, false, "scala.Tuple3", {
  T3: 1,
  O: 1,
  s_Product3: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T3.prototype.$classData = $d_T3;
/** @constructor */
function $c_jl_ArrayIndexOutOfBoundsException() {
  $c_jl_IndexOutOfBoundsException.call(this)
}
$c_jl_ArrayIndexOutOfBoundsException.prototype = new $h_jl_IndexOutOfBoundsException();
$c_jl_ArrayIndexOutOfBoundsException.prototype.constructor = $c_jl_ArrayIndexOutOfBoundsException;
/** @constructor */
function $h_jl_ArrayIndexOutOfBoundsException() {
  /*<skip>*/
}
$h_jl_ArrayIndexOutOfBoundsException.prototype = $c_jl_ArrayIndexOutOfBoundsException.prototype;
$c_jl_ArrayIndexOutOfBoundsException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_ArrayIndexOutOfBoundsException = new $TypeData().initClass({
  jl_ArrayIndexOutOfBoundsException: 0
}, false, "java.lang.ArrayIndexOutOfBoundsException", {
  jl_ArrayIndexOutOfBoundsException: 1,
  jl_IndexOutOfBoundsException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ArrayIndexOutOfBoundsException.prototype.$classData = $d_jl_ArrayIndexOutOfBoundsException;
/** @constructor */
function $c_jl_NumberFormatException() {
  $c_jl_IllegalArgumentException.call(this)
}
$c_jl_NumberFormatException.prototype = new $h_jl_IllegalArgumentException();
$c_jl_NumberFormatException.prototype.constructor = $c_jl_NumberFormatException;
/** @constructor */
function $h_jl_NumberFormatException() {
  /*<skip>*/
}
$h_jl_NumberFormatException.prototype = $c_jl_NumberFormatException.prototype;
$c_jl_NumberFormatException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_NumberFormatException = new $TypeData().initClass({
  jl_NumberFormatException: 0
}, false, "java.lang.NumberFormatException", {
  jl_NumberFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NumberFormatException.prototype.$classData = $d_jl_NumberFormatException;
/** @constructor */
function $c_ju_FormatterClosedException() {
  $c_jl_IllegalStateException.call(this)
}
$c_ju_FormatterClosedException.prototype = new $h_jl_IllegalStateException();
$c_ju_FormatterClosedException.prototype.constructor = $c_ju_FormatterClosedException;
/** @constructor */
function $h_ju_FormatterClosedException() {
  /*<skip>*/
}
$h_ju_FormatterClosedException.prototype = $c_ju_FormatterClosedException.prototype;
$c_ju_FormatterClosedException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_ju_FormatterClosedException = new $TypeData().initClass({
  ju_FormatterClosedException: 0
}, false, "java.util.FormatterClosedException", {
  ju_FormatterClosedException: 1,
  jl_IllegalStateException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_FormatterClosedException.prototype.$classData = $d_ju_FormatterClosedException;
/** @constructor */
function $c_ju_IllegalFormatException() {
  $c_jl_IllegalArgumentException.call(this)
}
$c_ju_IllegalFormatException.prototype = new $h_jl_IllegalArgumentException();
$c_ju_IllegalFormatException.prototype.constructor = $c_ju_IllegalFormatException;
/** @constructor */
function $h_ju_IllegalFormatException() {
  /*<skip>*/
}
$h_ju_IllegalFormatException.prototype = $c_ju_IllegalFormatException.prototype;
/** @constructor */
function $c_s_None$() {
  $c_s_Option.call(this)
}
$c_s_None$.prototype = new $h_s_Option();
$c_s_None$.prototype.constructor = $c_s_None$;
/** @constructor */
function $h_s_None$() {
  /*<skip>*/
}
$h_s_None$.prototype = $c_s_None$.prototype;
$c_s_None$.prototype.init___ = (function() {
  return this
});
$c_s_None$.prototype.productPrefix__T = (function() {
  return "None"
});
$c_s_None$.prototype.productArity__I = (function() {
  return 0
});
$c_s_None$.prototype.isEmpty__Z = (function() {
  return true
});
$c_s_None$.prototype.get__O = (function() {
  this.get__sr_Nothing$()
});
$c_s_None$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_s_None$.prototype.toString__T = (function() {
  return "None"
});
$c_s_None$.prototype.get__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("None.get")
});
$c_s_None$.prototype.hashCode__I = (function() {
  return 2433880
});
$c_s_None$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_s_None$ = new $TypeData().initClass({
  s_None$: 0
}, false, "scala.None$", {
  s_None$: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_None$.prototype.$classData = $d_s_None$;
var $n_s_None$ = (void 0);
function $m_s_None$() {
  if ((!$n_s_None$)) {
    $n_s_None$ = new $c_s_None$().init___()
  };
  return $n_s_None$
}
/** @constructor */
function $c_s_Some() {
  $c_s_Option.call(this);
  this.value$2 = null
}
$c_s_Some.prototype = new $h_s_Option();
$c_s_Some.prototype.constructor = $c_s_Some;
/** @constructor */
function $h_s_Some() {
  /*<skip>*/
}
$h_s_Some.prototype = $c_s_Some.prototype;
$c_s_Some.prototype.productPrefix__T = (function() {
  return "Some"
});
$c_s_Some.prototype.productArity__I = (function() {
  return 1
});
$c_s_Some.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_Some(x$1)) {
    var Some$1 = $as_s_Some(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.value$2, Some$1.value$2)
  } else {
    return false
  }
});
$c_s_Some.prototype.isEmpty__Z = (function() {
  return false
});
$c_s_Some.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_Some.prototype.get__O = (function() {
  return this.value$2
});
$c_s_Some.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_Some.prototype.init___O = (function(value) {
  this.value$2 = value;
  return this
});
$c_s_Some.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_Some.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_Some(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Some)))
}
function $as_s_Some(obj) {
  return (($is_s_Some(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Some"))
}
function $isArrayOf_s_Some(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Some)))
}
function $asArrayOf_s_Some(obj, depth) {
  return (($isArrayOf_s_Some(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Some;", depth))
}
var $d_s_Some = new $TypeData().initClass({
  s_Some: 0
}, false, "scala.Some", {
  s_Some: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Some.prototype.$classData = $d_s_Some;
/** @constructor */
function $c_s_util_Failure() {
  $c_s_util_Try.call(this);
  this.exception$2 = null
}
$c_s_util_Failure.prototype = new $h_s_util_Try();
$c_s_util_Failure.prototype.constructor = $c_s_util_Failure;
/** @constructor */
function $h_s_util_Failure() {
  /*<skip>*/
}
$h_s_util_Failure.prototype = $c_s_util_Failure.prototype;
$c_s_util_Failure.prototype.productPrefix__T = (function() {
  return "Failure"
});
$c_s_util_Failure.prototype.productArity__I = (function() {
  return 1
});
$c_s_util_Failure.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_util_Failure(x$1)) {
    var Failure$1 = $as_s_util_Failure(x$1);
    var x = this.exception$2;
    var x$2 = Failure$1.exception$2;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_s_util_Failure.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.exception$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_util_Failure.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_util_Failure.prototype.init___jl_Throwable = (function(exception) {
  this.exception$2 = exception;
  return this
});
$c_s_util_Failure.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_util_Failure.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_util_Failure(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_Failure)))
}
function $as_s_util_Failure(obj) {
  return (($is_s_util_Failure(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.Failure"))
}
function $isArrayOf_s_util_Failure(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_Failure)))
}
function $asArrayOf_s_util_Failure(obj, depth) {
  return (($isArrayOf_s_util_Failure(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.Failure;", depth))
}
var $d_s_util_Failure = new $TypeData().initClass({
  s_util_Failure: 0
}, false, "scala.util.Failure", {
  s_util_Failure: 1,
  s_util_Try: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Failure.prototype.$classData = $d_s_util_Failure;
/** @constructor */
function $c_s_util_Success() {
  $c_s_util_Try.call(this);
  this.value$2 = null
}
$c_s_util_Success.prototype = new $h_s_util_Try();
$c_s_util_Success.prototype.constructor = $c_s_util_Success;
/** @constructor */
function $h_s_util_Success() {
  /*<skip>*/
}
$h_s_util_Success.prototype = $c_s_util_Success.prototype;
$c_s_util_Success.prototype.productPrefix__T = (function() {
  return "Success"
});
$c_s_util_Success.prototype.productArity__I = (function() {
  return 1
});
$c_s_util_Success.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_util_Success(x$1)) {
    var Success$1 = $as_s_util_Success(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.value$2, Success$1.value$2)
  } else {
    return false
  }
});
$c_s_util_Success.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_util_Success.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_util_Success.prototype.init___O = (function(value) {
  this.value$2 = value;
  return this
});
$c_s_util_Success.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_util_Success.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_util_Success(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_util_Success)))
}
function $as_s_util_Success(obj) {
  return (($is_s_util_Success(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.util.Success"))
}
function $isArrayOf_s_util_Success(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_util_Success)))
}
function $asArrayOf_s_util_Success(obj, depth) {
  return (($isArrayOf_s_util_Success(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.util.Success;", depth))
}
var $d_s_util_Success = new $TypeData().initClass({
  s_util_Success: 0
}, false, "scala.util.Success", {
  s_util_Success: 1,
  s_util_Try: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Success.prototype.$classData = $d_s_util_Success;
function $f_sc_TraversableLike__flatMap__F1__scg_CanBuildFrom__O($thiz, f, bf) {
  var b = bf.apply__O__scm_Builder($thiz.repr__O());
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1, b$1) {
    return (function(x$2) {
      return $as_scm_Builder(b$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($as_sc_GenTraversableOnce(f$1.apply__O__O(x$2)).seq__sc_TraversableOnce()))
    })
  })($thiz, f, b)));
  return b.result__O()
}
function $f_sc_TraversableLike__to__scg_CanBuildFrom__O($thiz, cbf) {
  var b = cbf.apply__scm_Builder();
  $f_scm_Builder__sizeHint__sc_TraversableLike__V(b, $thiz);
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($thiz.thisCollection__sc_Traversable());
  return b.result__O()
}
function $f_sc_TraversableLike__isPartLikelySynthetic$1__psc_TraversableLike__T__I__Z($thiz, fqn$1, partStart$1) {
  var firstChar = (65535 & $uI(fqn$1.charCodeAt(partStart$1)));
  return (((firstChar > 90) && (firstChar < 127)) || (firstChar < 65))
}
function $f_sc_TraversableLike__toString__T($thiz) {
  return $thiz.mkString__T__T__T__T(($thiz.stringPrefix__T() + "("), ", ", ")")
}
function $f_sc_TraversableLike__map__F1__scg_CanBuildFrom__O($thiz, f, bf) {
  var b = $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder($thiz, bf);
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1, b$1) {
    return (function(x$2) {
      return b$1.$$plus$eq__O__scm_Builder(f$1.apply__O__O(x$2))
    })
  })($thiz, f, b)));
  return b.result__O()
}
function $f_sc_TraversableLike__builder$1__psc_TraversableLike__scg_CanBuildFrom__scm_Builder($thiz, bf$1) {
  var b = bf$1.apply__O__scm_Builder($thiz.repr__O());
  $f_scm_Builder__sizeHint__sc_TraversableLike__V(b, $thiz);
  return b
}
function $f_sc_TraversableLike__stringPrefix__T($thiz) {
  var this$1 = $thiz.repr__O();
  var fqn = $objectGetClass(this$1).getName__T();
  var pos = (((-1) + $uI(fqn.length)) | 0);
  while (true) {
    if ((pos !== (-1))) {
      var index = pos;
      var jsx$1 = ((65535 & $uI(fqn.charCodeAt(index))) === 36)
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      pos = (((-1) + pos) | 0)
    } else {
      break
    }
  };
  if ((pos === (-1))) {
    var jsx$2 = true
  } else {
    var index$1 = pos;
    var jsx$2 = ((65535 & $uI(fqn.charCodeAt(index$1))) === 46)
  };
  if (jsx$2) {
    return ""
  };
  var result = "";
  while (true) {
    var partEnd = ((1 + pos) | 0);
    while (true) {
      if ((pos !== (-1))) {
        var index$2 = pos;
        var jsx$4 = ((65535 & $uI(fqn.charCodeAt(index$2))) <= 57)
      } else {
        var jsx$4 = false
      };
      if (jsx$4) {
        var index$3 = pos;
        var jsx$3 = ((65535 & $uI(fqn.charCodeAt(index$3))) >= 48)
      } else {
        var jsx$3 = false
      };
      if (jsx$3) {
        pos = (((-1) + pos) | 0)
      } else {
        break
      }
    };
    var lastNonDigit = pos;
    while (true) {
      if ((pos !== (-1))) {
        var index$4 = pos;
        var jsx$6 = ((65535 & $uI(fqn.charCodeAt(index$4))) !== 36)
      } else {
        var jsx$6 = false
      };
      if (jsx$6) {
        var index$5 = pos;
        var jsx$5 = ((65535 & $uI(fqn.charCodeAt(index$5))) !== 46)
      } else {
        var jsx$5 = false
      };
      if (jsx$5) {
        pos = (((-1) + pos) | 0)
      } else {
        break
      }
    };
    var partStart = ((1 + pos) | 0);
    if (((pos === lastNonDigit) && (partEnd !== $uI(fqn.length)))) {
      return result
    };
    while (true) {
      if ((pos !== (-1))) {
        var index$6 = pos;
        var jsx$7 = ((65535 & $uI(fqn.charCodeAt(index$6))) === 36)
      } else {
        var jsx$7 = false
      };
      if (jsx$7) {
        pos = (((-1) + pos) | 0)
      } else {
        break
      }
    };
    if ((pos === (-1))) {
      var atEnd = true
    } else {
      var index$7 = pos;
      var atEnd = ((65535 & $uI(fqn.charCodeAt(index$7))) === 46)
    };
    if ((atEnd || (!$f_sc_TraversableLike__isPartLikelySynthetic$1__psc_TraversableLike__T__I__Z($thiz, fqn, partStart)))) {
      var part = $as_T(fqn.substring(partStart, partEnd));
      var thiz = result;
      if ((thiz === null)) {
        throw new $c_jl_NullPointerException().init___()
      };
      if ((thiz === "")) {
        result = part
      } else {
        result = ((("" + part) + new $c_jl_Character().init___C(46)) + result)
      };
      if (atEnd) {
        return result
      }
    }
  }
}
/** @constructor */
function $c_scg_SeqFactory() {
  $c_scg_GenSeqFactory.call(this)
}
$c_scg_SeqFactory.prototype = new $h_scg_GenSeqFactory();
$c_scg_SeqFactory.prototype.constructor = $c_scg_SeqFactory;
/** @constructor */
function $h_scg_SeqFactory() {
  /*<skip>*/
}
$h_scg_SeqFactory.prototype = $c_scg_SeqFactory.prototype;
/** @constructor */
function $c_sci_Stream$StreamBuilder() {
  $c_scm_LazyBuilder.call(this)
}
$c_sci_Stream$StreamBuilder.prototype = new $h_scm_LazyBuilder();
$c_sci_Stream$StreamBuilder.prototype.constructor = $c_sci_Stream$StreamBuilder;
/** @constructor */
function $h_sci_Stream$StreamBuilder() {
  /*<skip>*/
}
$h_sci_Stream$StreamBuilder.prototype = $c_sci_Stream$StreamBuilder.prototype;
$c_sci_Stream$StreamBuilder.prototype.init___ = (function() {
  $c_scm_LazyBuilder.prototype.init___.call(this);
  return this
});
$c_sci_Stream$StreamBuilder.prototype.result__O = (function() {
  return this.result__sci_Stream()
});
$c_sci_Stream$StreamBuilder.prototype.result__sci_Stream = (function() {
  var this$1 = this.parts$1;
  return $as_sci_Stream(this$1.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream().flatMap__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$5$2) {
      var x$5 = $as_sc_TraversableOnce(x$5$2);
      return x$5.toStream__sci_Stream()
    })
  })(this)), ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___())))
});
function $is_sci_Stream$StreamBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream$StreamBuilder)))
}
function $as_sci_Stream$StreamBuilder(obj) {
  return (($is_sci_Stream$StreamBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream$StreamBuilder"))
}
function $isArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream$StreamBuilder)))
}
function $asArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (($isArrayOf_sci_Stream$StreamBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream$StreamBuilder;", depth))
}
var $d_sci_Stream$StreamBuilder = new $TypeData().initClass({
  sci_Stream$StreamBuilder: 0
}, false, "scala.collection.immutable.Stream$StreamBuilder", {
  sci_Stream$StreamBuilder: 1,
  scm_LazyBuilder: 1,
  O: 1,
  scm_ReusableBuilder: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_Stream$StreamBuilder.prototype.$classData = $d_sci_Stream$StreamBuilder;
/** @constructor */
function $c_sci_VectorBuilder() {
  $c_O.call(this);
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  this.depth$1 = 0;
  this.display0$1 = null;
  this.display1$1 = null;
  this.display2$1 = null;
  this.display3$1 = null;
  this.display4$1 = null;
  this.display5$1 = null
}
$c_sci_VectorBuilder.prototype = new $h_O();
$c_sci_VectorBuilder.prototype.constructor = $c_sci_VectorBuilder;
/** @constructor */
function $h_sci_VectorBuilder() {
  /*<skip>*/
}
$h_sci_VectorBuilder.prototype = $c_sci_VectorBuilder.prototype;
$c_sci_VectorBuilder.prototype.display3__AO = (function() {
  return this.display3$1
});
$c_sci_VectorBuilder.prototype.init___ = (function() {
  this.display0$1 = $newArrayObject($d_O.getArrayOf(), [32]);
  this.depth$1 = 1;
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  return this
});
$c_sci_VectorBuilder.prototype.depth__I = (function() {
  return this.depth$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$1 = x$1
});
$c_sci_VectorBuilder.prototype.display0__AO = (function() {
  return this.display0$1
});
$c_sci_VectorBuilder.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$1 = x$1
});
$c_sci_VectorBuilder.prototype.display4__AO = (function() {
  return this.display4$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__sci_VectorBuilder = (function(elem) {
  if ((this.lo$1 >= this.display0$1.u.length)) {
    var newBlockIndex = ((32 + this.blockIndex$1) | 0);
    var xor = (this.blockIndex$1 ^ newBlockIndex);
    $f_sci_VectorPointer__gotoNextBlockStartWritable__I__I__V(this, newBlockIndex, xor);
    this.blockIndex$1 = newBlockIndex;
    this.lo$1 = 0
  };
  this.display0$1.set(this.lo$1, elem);
  this.lo$1 = ((1 + this.lo$1) | 0);
  return this
});
$c_sci_VectorBuilder.prototype.result__O = (function() {
  return this.result__sci_Vector()
});
$c_sci_VectorBuilder.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$1 = x$1
});
$c_sci_VectorBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_VectorBuilder.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$1 = x$1
});
$c_sci_VectorBuilder.prototype.display1__AO = (function() {
  return this.display1$1
});
$c_sci_VectorBuilder.prototype.display5__AO = (function() {
  return this.display5$1
});
$c_sci_VectorBuilder.prototype.result__sci_Vector = (function() {
  var size = ((this.blockIndex$1 + this.lo$1) | 0);
  if ((size === 0)) {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  };
  var s = new $c_sci_Vector().init___I__I__I(0, size, 0);
  var depth = this.depth$1;
  $f_sci_VectorPointer__initFrom__sci_VectorPointer__I__V(s, this, depth);
  if ((this.depth$1 > 1)) {
    var xor = (((-1) + size) | 0);
    $f_sci_VectorPointer__gotoPos__I__I__V(s, 0, xor)
  };
  return s
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_VectorBuilder.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$1 = x$1
});
$c_sci_VectorBuilder.prototype.display2__AO = (function() {
  return this.display2$1
});
$c_sci_VectorBuilder.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $as_sci_VectorBuilder($f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs))
});
$c_sci_VectorBuilder.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$1 = x$1
});
function $is_sci_VectorBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_VectorBuilder)))
}
function $as_sci_VectorBuilder(obj) {
  return (($is_sci_VectorBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.VectorBuilder"))
}
function $isArrayOf_sci_VectorBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_VectorBuilder)))
}
function $asArrayOf_sci_VectorBuilder(obj, depth) {
  return (($isArrayOf_sci_VectorBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.VectorBuilder;", depth))
}
var $d_sci_VectorBuilder = new $TypeData().initClass({
  sci_VectorBuilder: 0
}, false, "scala.collection.immutable.VectorBuilder", {
  sci_VectorBuilder: 1,
  O: 1,
  scm_ReusableBuilder: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorBuilder.prototype.$classData = $d_sci_VectorBuilder;
/** @constructor */
function $c_sci_VectorIterator() {
  $c_sc_AbstractIterator.call(this);
  this.endIndex$2 = 0;
  this.blockIndex$2 = 0;
  this.lo$2 = 0;
  this.endLo$2 = 0;
  this.$$undhasNext$2 = false;
  this.depth$2 = 0;
  this.display0$2 = null;
  this.display1$2 = null;
  this.display2$2 = null;
  this.display3$2 = null;
  this.display4$2 = null;
  this.display5$2 = null
}
$c_sci_VectorIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_VectorIterator.prototype.constructor = $c_sci_VectorIterator;
/** @constructor */
function $h_sci_VectorIterator() {
  /*<skip>*/
}
$h_sci_VectorIterator.prototype = $c_sci_VectorIterator.prototype;
$c_sci_VectorIterator.prototype.next__O = (function() {
  if ((!this.$$undhasNext$2)) {
    throw new $c_ju_NoSuchElementException().init___T("reached iterator end")
  };
  var res = this.display0$2.get(this.lo$2);
  this.lo$2 = ((1 + this.lo$2) | 0);
  if ((this.lo$2 === this.endLo$2)) {
    if ((((this.blockIndex$2 + this.lo$2) | 0) < this.endIndex$2)) {
      var newBlockIndex = ((32 + this.blockIndex$2) | 0);
      var xor = (this.blockIndex$2 ^ newBlockIndex);
      $f_sci_VectorPointer__gotoNextBlockStart__I__I__V(this, newBlockIndex, xor);
      this.blockIndex$2 = newBlockIndex;
      var x = ((this.endIndex$2 - this.blockIndex$2) | 0);
      this.endLo$2 = ((x < 32) ? x : 32);
      this.lo$2 = 0
    } else {
      this.$$undhasNext$2 = false
    }
  };
  return res
});
$c_sci_VectorIterator.prototype.display3__AO = (function() {
  return this.display3$2
});
$c_sci_VectorIterator.prototype.depth__I = (function() {
  return this.depth$2
});
$c_sci_VectorIterator.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$2 = x$1
});
$c_sci_VectorIterator.prototype.init___I__I = (function(_startIndex, endIndex) {
  this.endIndex$2 = endIndex;
  this.blockIndex$2 = ((-32) & _startIndex);
  this.lo$2 = (31 & _startIndex);
  var x = ((endIndex - this.blockIndex$2) | 0);
  this.endLo$2 = ((x < 32) ? x : 32);
  this.$$undhasNext$2 = (((this.blockIndex$2 + this.lo$2) | 0) < endIndex);
  return this
});
$c_sci_VectorIterator.prototype.display0__AO = (function() {
  return this.display0$2
});
$c_sci_VectorIterator.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$2 = x$1
});
$c_sci_VectorIterator.prototype.display4__AO = (function() {
  return this.display4$2
});
$c_sci_VectorIterator.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$2 = x$1
});
$c_sci_VectorIterator.prototype.hasNext__Z = (function() {
  return this.$$undhasNext$2
});
$c_sci_VectorIterator.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$2 = x$1
});
$c_sci_VectorIterator.prototype.display1__AO = (function() {
  return this.display1$2
});
$c_sci_VectorIterator.prototype.display5__AO = (function() {
  return this.display5$2
});
$c_sci_VectorIterator.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$2 = x$1
});
$c_sci_VectorIterator.prototype.display2__AO = (function() {
  return this.display2$2
});
$c_sci_VectorIterator.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$2 = x$1
});
$c_sci_VectorIterator.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$2 = x$1
});
var $d_sci_VectorIterator = new $TypeData().initClass({
  sci_VectorIterator: 0
}, false, "scala.collection.immutable.VectorIterator", {
  sci_VectorIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorIterator.prototype.$classData = $d_sci_VectorIterator;
/** @constructor */
function $c_sjsr_UndefinedBehaviorError() {
  $c_jl_Error.call(this)
}
$c_sjsr_UndefinedBehaviorError.prototype = new $h_jl_Error();
$c_sjsr_UndefinedBehaviorError.prototype.constructor = $c_sjsr_UndefinedBehaviorError;
/** @constructor */
function $h_sjsr_UndefinedBehaviorError() {
  /*<skip>*/
}
$h_sjsr_UndefinedBehaviorError.prototype = $c_sjsr_UndefinedBehaviorError.prototype;
$c_sjsr_UndefinedBehaviorError.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.init___jl_Throwable = (function(cause) {
  $c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable.call(this, ("An undefined behavior was detected" + ((cause === null) ? "" : (": " + cause.getMessage__T()))), cause);
  return this
});
$c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable = (function(message, cause) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, message, cause);
  return this
});
var $d_sjsr_UndefinedBehaviorError = new $TypeData().initClass({
  sjsr_UndefinedBehaviorError: 0
}, false, "scala.scalajs.runtime.UndefinedBehaviorError", {
  sjsr_UndefinedBehaviorError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sjsr_UndefinedBehaviorError.prototype.$classData = $d_sjsr_UndefinedBehaviorError;
/** @constructor */
function $c_Ljava_io_PrintStream() {
  $c_Ljava_io_FilterOutputStream.call(this);
  this.encoder$3 = null;
  this.autoFlush$3 = false;
  this.charset$3 = null;
  this.closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  this.bitmap$0$3 = false
}
$c_Ljava_io_PrintStream.prototype = new $h_Ljava_io_FilterOutputStream();
$c_Ljava_io_PrintStream.prototype.constructor = $c_Ljava_io_PrintStream;
/** @constructor */
function $h_Ljava_io_PrintStream() {
  /*<skip>*/
}
$h_Ljava_io_PrintStream.prototype = $c_Ljava_io_PrintStream.prototype;
$c_Ljava_io_PrintStream.prototype.append__jl_CharSequence__jl_Appendable = (function(x$1) {
  return this.append__jl_CharSequence__Ljava_io_PrintStream(x$1)
});
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset = (function(_out, autoFlush, charset) {
  this.autoFlush$3 = autoFlush;
  this.charset$3 = charset;
  $c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream.call(this, _out);
  this.closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  return this
});
$c_Ljava_io_PrintStream.prototype.append__jl_CharSequence__Ljava_io_PrintStream = (function(csq) {
  this.print__T__V(((csq === null) ? "null" : $objectToString(csq)));
  return this
});
function $is_Ljava_io_PrintStream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_PrintStream)))
}
function $as_Ljava_io_PrintStream(obj) {
  return (($is_Ljava_io_PrintStream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.PrintStream"))
}
function $isArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_PrintStream)))
}
function $asArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (($isArrayOf_Ljava_io_PrintStream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.PrintStream;", depth))
}
/** @constructor */
function $c_ju_Arrays$$anon$3() {
  $c_O.call(this);
  this.cmp$1$1 = null
}
$c_ju_Arrays$$anon$3.prototype = new $h_O();
$c_ju_Arrays$$anon$3.prototype.constructor = $c_ju_Arrays$$anon$3;
/** @constructor */
function $h_ju_Arrays$$anon$3() {
  /*<skip>*/
}
$h_ju_Arrays$$anon$3.prototype = $c_ju_Arrays$$anon$3.prototype;
$c_ju_Arrays$$anon$3.prototype.init___ju_Comparator = (function(cmp$1) {
  this.cmp$1$1 = cmp$1;
  return this
});
$c_ju_Arrays$$anon$3.prototype.compare__O__O__I = (function(x, y) {
  return this.cmp$1$1.compare__O__O__I(x, y)
});
var $d_ju_Arrays$$anon$3 = new $TypeData().initClass({
  ju_Arrays$$anon$3: 0
}, false, "java.util.Arrays$$anon$3", {
  ju_Arrays$$anon$3: 1,
  O: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Arrays$$anon$3.prototype.$classData = $d_ju_Arrays$$anon$3;
/** @constructor */
function $c_ju_DuplicateFormatFlagsException() {
  $c_ju_IllegalFormatException.call(this);
  this.f$6 = null
}
$c_ju_DuplicateFormatFlagsException.prototype = new $h_ju_IllegalFormatException();
$c_ju_DuplicateFormatFlagsException.prototype.constructor = $c_ju_DuplicateFormatFlagsException;
/** @constructor */
function $h_ju_DuplicateFormatFlagsException() {
  /*<skip>*/
}
$h_ju_DuplicateFormatFlagsException.prototype = $c_ju_DuplicateFormatFlagsException.prototype;
$c_ju_DuplicateFormatFlagsException.prototype.getMessage__T = (function() {
  return (("Flags = '" + this.f$6) + "'")
});
$c_ju_DuplicateFormatFlagsException.prototype.init___T = (function(f) {
  this.f$6 = f;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((f === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_DuplicateFormatFlagsException = new $TypeData().initClass({
  ju_DuplicateFormatFlagsException: 0
}, false, "java.util.DuplicateFormatFlagsException", {
  ju_DuplicateFormatFlagsException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_DuplicateFormatFlagsException.prototype.$classData = $d_ju_DuplicateFormatFlagsException;
/** @constructor */
function $c_ju_FormatFlagsConversionMismatchException() {
  $c_ju_IllegalFormatException.call(this);
  this.f$6 = null;
  this.c$6 = 0
}
$c_ju_FormatFlagsConversionMismatchException.prototype = new $h_ju_IllegalFormatException();
$c_ju_FormatFlagsConversionMismatchException.prototype.constructor = $c_ju_FormatFlagsConversionMismatchException;
/** @constructor */
function $h_ju_FormatFlagsConversionMismatchException() {
  /*<skip>*/
}
$h_ju_FormatFlagsConversionMismatchException.prototype = $c_ju_FormatFlagsConversionMismatchException.prototype;
$c_ju_FormatFlagsConversionMismatchException.prototype.getMessage__T = (function() {
  var c = this.c$6;
  return ((("Conversion = " + new $c_jl_Character().init___C(c)) + ", Flags = ") + this.f$6)
});
$c_ju_FormatFlagsConversionMismatchException.prototype.init___T__C = (function(f, c) {
  this.f$6 = f;
  this.c$6 = c;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((f === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_FormatFlagsConversionMismatchException = new $TypeData().initClass({
  ju_FormatFlagsConversionMismatchException: 0
}, false, "java.util.FormatFlagsConversionMismatchException", {
  ju_FormatFlagsConversionMismatchException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_FormatFlagsConversionMismatchException.prototype.$classData = $d_ju_FormatFlagsConversionMismatchException;
/** @constructor */
function $c_ju_IllegalFormatCodePointException() {
  $c_ju_IllegalFormatException.call(this);
  this.c$6 = 0
}
$c_ju_IllegalFormatCodePointException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatCodePointException.prototype.constructor = $c_ju_IllegalFormatCodePointException;
/** @constructor */
function $h_ju_IllegalFormatCodePointException() {
  /*<skip>*/
}
$h_ju_IllegalFormatCodePointException.prototype = $c_ju_IllegalFormatCodePointException.prototype;
$c_ju_IllegalFormatCodePointException.prototype.getMessage__T = (function() {
  var i = this.c$6;
  var x = $uD((i >>> 0));
  var jsx$1 = x.toString(16);
  return ("Code point = 0x" + $as_T(jsx$1))
});
$c_ju_IllegalFormatCodePointException.prototype.init___I = (function(c) {
  this.c$6 = c;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_ju_IllegalFormatCodePointException = new $TypeData().initClass({
  ju_IllegalFormatCodePointException: 0
}, false, "java.util.IllegalFormatCodePointException", {
  ju_IllegalFormatCodePointException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatCodePointException.prototype.$classData = $d_ju_IllegalFormatCodePointException;
/** @constructor */
function $c_ju_IllegalFormatConversionException() {
  $c_ju_IllegalFormatException.call(this);
  this.c$6 = 0;
  this.arg$6 = null
}
$c_ju_IllegalFormatConversionException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatConversionException.prototype.constructor = $c_ju_IllegalFormatConversionException;
/** @constructor */
function $h_ju_IllegalFormatConversionException() {
  /*<skip>*/
}
$h_ju_IllegalFormatConversionException.prototype = $c_ju_IllegalFormatConversionException.prototype;
$c_ju_IllegalFormatConversionException.prototype.getMessage__T = (function() {
  var c = this.c$6;
  return (($as_T($g.String.fromCharCode(c)) + " != ") + this.arg$6.getName__T())
});
$c_ju_IllegalFormatConversionException.prototype.init___C__jl_Class = (function(c, arg) {
  this.c$6 = c;
  this.arg$6 = arg;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((arg === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_IllegalFormatConversionException = new $TypeData().initClass({
  ju_IllegalFormatConversionException: 0
}, false, "java.util.IllegalFormatConversionException", {
  ju_IllegalFormatConversionException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatConversionException.prototype.$classData = $d_ju_IllegalFormatConversionException;
/** @constructor */
function $c_ju_IllegalFormatFlagsException() {
  $c_ju_IllegalFormatException.call(this);
  this.f$6 = null
}
$c_ju_IllegalFormatFlagsException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatFlagsException.prototype.constructor = $c_ju_IllegalFormatFlagsException;
/** @constructor */
function $h_ju_IllegalFormatFlagsException() {
  /*<skip>*/
}
$h_ju_IllegalFormatFlagsException.prototype = $c_ju_IllegalFormatFlagsException.prototype;
$c_ju_IllegalFormatFlagsException.prototype.getMessage__T = (function() {
  return (("Flags = '" + this.f$6) + "'")
});
$c_ju_IllegalFormatFlagsException.prototype.init___T = (function(f) {
  this.f$6 = f;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((f === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_IllegalFormatFlagsException = new $TypeData().initClass({
  ju_IllegalFormatFlagsException: 0
}, false, "java.util.IllegalFormatFlagsException", {
  ju_IllegalFormatFlagsException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatFlagsException.prototype.$classData = $d_ju_IllegalFormatFlagsException;
/** @constructor */
function $c_ju_IllegalFormatPrecisionException() {
  $c_ju_IllegalFormatException.call(this);
  this.p$6 = 0
}
$c_ju_IllegalFormatPrecisionException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatPrecisionException.prototype.constructor = $c_ju_IllegalFormatPrecisionException;
/** @constructor */
function $h_ju_IllegalFormatPrecisionException() {
  /*<skip>*/
}
$h_ju_IllegalFormatPrecisionException.prototype = $c_ju_IllegalFormatPrecisionException.prototype;
$c_ju_IllegalFormatPrecisionException.prototype.getMessage__T = (function() {
  var i = this.p$6;
  return ("" + i)
});
$c_ju_IllegalFormatPrecisionException.prototype.init___I = (function(p) {
  this.p$6 = p;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_ju_IllegalFormatPrecisionException = new $TypeData().initClass({
  ju_IllegalFormatPrecisionException: 0
}, false, "java.util.IllegalFormatPrecisionException", {
  ju_IllegalFormatPrecisionException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatPrecisionException.prototype.$classData = $d_ju_IllegalFormatPrecisionException;
/** @constructor */
function $c_ju_IllegalFormatWidthException() {
  $c_ju_IllegalFormatException.call(this);
  this.w$6 = 0
}
$c_ju_IllegalFormatWidthException.prototype = new $h_ju_IllegalFormatException();
$c_ju_IllegalFormatWidthException.prototype.constructor = $c_ju_IllegalFormatWidthException;
/** @constructor */
function $h_ju_IllegalFormatWidthException() {
  /*<skip>*/
}
$h_ju_IllegalFormatWidthException.prototype = $c_ju_IllegalFormatWidthException.prototype;
$c_ju_IllegalFormatWidthException.prototype.getMessage__T = (function() {
  var i = this.w$6;
  return ("" + i)
});
$c_ju_IllegalFormatWidthException.prototype.init___I = (function(w) {
  this.w$6 = w;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_ju_IllegalFormatWidthException = new $TypeData().initClass({
  ju_IllegalFormatWidthException: 0
}, false, "java.util.IllegalFormatWidthException", {
  ju_IllegalFormatWidthException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_IllegalFormatWidthException.prototype.$classData = $d_ju_IllegalFormatWidthException;
/** @constructor */
function $c_ju_MissingFormatArgumentException() {
  $c_ju_IllegalFormatException.call(this);
  this.s$6 = null
}
$c_ju_MissingFormatArgumentException.prototype = new $h_ju_IllegalFormatException();
$c_ju_MissingFormatArgumentException.prototype.constructor = $c_ju_MissingFormatArgumentException;
/** @constructor */
function $h_ju_MissingFormatArgumentException() {
  /*<skip>*/
}
$h_ju_MissingFormatArgumentException.prototype = $c_ju_MissingFormatArgumentException.prototype;
$c_ju_MissingFormatArgumentException.prototype.getMessage__T = (function() {
  return (("Format specifier '" + this.s$6) + "'")
});
$c_ju_MissingFormatArgumentException.prototype.init___T = (function(s) {
  this.s$6 = s;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((s === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_MissingFormatArgumentException = new $TypeData().initClass({
  ju_MissingFormatArgumentException: 0
}, false, "java.util.MissingFormatArgumentException", {
  ju_MissingFormatArgumentException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_MissingFormatArgumentException.prototype.$classData = $d_ju_MissingFormatArgumentException;
/** @constructor */
function $c_ju_MissingFormatWidthException() {
  $c_ju_IllegalFormatException.call(this);
  this.s$6 = null
}
$c_ju_MissingFormatWidthException.prototype = new $h_ju_IllegalFormatException();
$c_ju_MissingFormatWidthException.prototype.constructor = $c_ju_MissingFormatWidthException;
/** @constructor */
function $h_ju_MissingFormatWidthException() {
  /*<skip>*/
}
$h_ju_MissingFormatWidthException.prototype = $c_ju_MissingFormatWidthException.prototype;
$c_ju_MissingFormatWidthException.prototype.getMessage__T = (function() {
  return this.s$6
});
$c_ju_MissingFormatWidthException.prototype.init___T = (function(s) {
  this.s$6 = s;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((s === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_MissingFormatWidthException = new $TypeData().initClass({
  ju_MissingFormatWidthException: 0
}, false, "java.util.MissingFormatWidthException", {
  ju_MissingFormatWidthException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_MissingFormatWidthException.prototype.$classData = $d_ju_MissingFormatWidthException;
/** @constructor */
function $c_ju_UnknownFormatConversionException() {
  $c_ju_IllegalFormatException.call(this);
  this.s$6 = null
}
$c_ju_UnknownFormatConversionException.prototype = new $h_ju_IllegalFormatException();
$c_ju_UnknownFormatConversionException.prototype.constructor = $c_ju_UnknownFormatConversionException;
/** @constructor */
function $h_ju_UnknownFormatConversionException() {
  /*<skip>*/
}
$h_ju_UnknownFormatConversionException.prototype = $c_ju_UnknownFormatConversionException.prototype;
$c_ju_UnknownFormatConversionException.prototype.getMessage__T = (function() {
  return (("Conversion = '" + this.s$6) + "'")
});
$c_ju_UnknownFormatConversionException.prototype.init___T = (function(s) {
  this.s$6 = s;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  if ((s === null)) {
    throw new $c_jl_NullPointerException().init___()
  };
  return this
});
var $d_ju_UnknownFormatConversionException = new $TypeData().initClass({
  ju_UnknownFormatConversionException: 0
}, false, "java.util.UnknownFormatConversionException", {
  ju_UnknownFormatConversionException: 1,
  ju_IllegalFormatException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_UnknownFormatConversionException.prototype.$classData = $d_ju_UnknownFormatConversionException;
/** @constructor */
function $c_s_math_Ordering$$anon$5() {
  $c_O.call(this);
  this.$$outer$1 = null;
  this.f$1$1 = null
}
$c_s_math_Ordering$$anon$5.prototype = new $h_O();
$c_s_math_Ordering$$anon$5.prototype.constructor = $c_s_math_Ordering$$anon$5;
/** @constructor */
function $h_s_math_Ordering$$anon$5() {
  /*<skip>*/
}
$h_s_math_Ordering$$anon$5.prototype = $c_s_math_Ordering$$anon$5.prototype;
$c_s_math_Ordering$$anon$5.prototype.compare__O__O__I = (function(x, y) {
  return this.$$outer$1.compare__O__O__I(this.f$1$1.apply__O__O(x), this.f$1$1.apply__O__O(y))
});
$c_s_math_Ordering$$anon$5.prototype.init___s_math_Ordering__F1 = (function($$outer, f$1) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  this.f$1$1 = f$1;
  return this
});
var $d_s_math_Ordering$$anon$5 = new $TypeData().initClass({
  s_math_Ordering$$anon$5: 0
}, false, "scala.math.Ordering$$anon$5", {
  s_math_Ordering$$anon$5: 1,
  O: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$$anon$5.prototype.$classData = $d_s_math_Ordering$$anon$5;
/** @constructor */
function $c_sc_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sc_Seq$.prototype = new $h_scg_SeqFactory();
$c_sc_Seq$.prototype.constructor = $c_sc_Seq$;
/** @constructor */
function $h_sc_Seq$() {
  /*<skip>*/
}
$h_sc_Seq$.prototype = $c_sc_Seq$.prototype;
$c_sc_Seq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sc_Seq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Seq$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Seq$ = new $TypeData().initClass({
  sc_Seq$: 0
}, false, "scala.collection.Seq$", {
  sc_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Seq$.prototype.$classData = $d_sc_Seq$;
var $n_sc_Seq$ = (void 0);
function $m_sc_Seq$() {
  if ((!$n_sc_Seq$)) {
    $n_sc_Seq$ = new $c_sc_Seq$().init___()
  };
  return $n_sc_Seq$
}
/** @constructor */
function $c_scg_IndexedSeqFactory() {
  $c_scg_SeqFactory.call(this)
}
$c_scg_IndexedSeqFactory.prototype = new $h_scg_SeqFactory();
$c_scg_IndexedSeqFactory.prototype.constructor = $c_scg_IndexedSeqFactory;
/** @constructor */
function $h_scg_IndexedSeqFactory() {
  /*<skip>*/
}
$h_scg_IndexedSeqFactory.prototype = $c_scg_IndexedSeqFactory.prototype;
/** @constructor */
function $c_sci_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Seq$.prototype = new $h_scg_SeqFactory();
$c_sci_Seq$.prototype.constructor = $c_sci_Seq$;
/** @constructor */
function $h_sci_Seq$() {
  /*<skip>*/
}
$h_sci_Seq$.prototype = $c_sci_Seq$.prototype;
$c_sci_Seq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Seq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Seq$ = new $TypeData().initClass({
  sci_Seq$: 0
}, false, "scala.collection.immutable.Seq$", {
  sci_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Seq$.prototype.$classData = $d_sci_Seq$;
var $n_sci_Seq$ = (void 0);
function $m_sci_Seq$() {
  if ((!$n_sci_Seq$)) {
    $n_sci_Seq$ = new $c_sci_Seq$().init___()
  };
  return $n_sci_Seq$
}
/** @constructor */
function $c_scm_IndexedSeq$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_IndexedSeq$.prototype = new $h_scg_SeqFactory();
$c_scm_IndexedSeq$.prototype.constructor = $c_scm_IndexedSeq$;
/** @constructor */
function $h_scm_IndexedSeq$() {
  /*<skip>*/
}
$h_scm_IndexedSeq$.prototype = $c_scm_IndexedSeq$.prototype;
$c_scm_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_IndexedSeq$ = new $TypeData().initClass({
  scm_IndexedSeq$: 0
}, false, "scala.collection.mutable.IndexedSeq$", {
  scm_IndexedSeq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_IndexedSeq$.prototype.$classData = $d_scm_IndexedSeq$;
var $n_scm_IndexedSeq$ = (void 0);
function $m_scm_IndexedSeq$() {
  if ((!$n_scm_IndexedSeq$)) {
    $n_scm_IndexedSeq$ = new $c_scm_IndexedSeq$().init___()
  };
  return $n_scm_IndexedSeq$
}
/** @constructor */
function $c_sjs_js_WrappedArray$() {
  $c_scg_SeqFactory.call(this)
}
$c_sjs_js_WrappedArray$.prototype = new $h_scg_SeqFactory();
$c_sjs_js_WrappedArray$.prototype.constructor = $c_sjs_js_WrappedArray$;
/** @constructor */
function $h_sjs_js_WrappedArray$() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray$.prototype = $c_sjs_js_WrappedArray$.prototype;
$c_sjs_js_WrappedArray$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sjs_js_WrappedArray$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_WrappedArray().init___()
});
var $d_sjs_js_WrappedArray$ = new $TypeData().initClass({
  sjs_js_WrappedArray$: 0
}, false, "scala.scalajs.js.WrappedArray$", {
  sjs_js_WrappedArray$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sjs_js_WrappedArray$.prototype.$classData = $d_sjs_js_WrappedArray$;
var $n_sjs_js_WrappedArray$ = (void 0);
function $m_sjs_js_WrappedArray$() {
  if ((!$n_sjs_js_WrappedArray$)) {
    $n_sjs_js_WrappedArray$ = new $c_sjs_js_WrappedArray$().init___()
  };
  return $n_sjs_js_WrappedArray$
}
function $is_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_Generic$MountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.Generic$MountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_Generic$MountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.Generic$MountedWithRoot;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_PackageBase() {
  $c_Ljapgolly_scalajs_react_vdom_Exports.call(this);
  this.vdomAttrVtBoolean$2 = null;
  this.vdomAttrVtString$2 = null;
  this.vdomAttrVtInt$2 = null;
  this.vdomAttrVtLong$2 = null;
  this.vdomAttrVtFloat$2 = null;
  this.vdomAttrVtDouble$2 = null;
  this.vdomAttrVtShort$2 = null;
  this.vdomAttrVtByte$2 = null;
  this.vdomAttrVtJsObject$2 = null;
  this.vdomAttrVtInnerHtml$2 = null;
  this.vdomAttrVtKeyL$2 = null;
  this.vdomAttrVtKeyS$2 = null;
  this.bitmap$0$2 = 0
}
$c_Ljapgolly_scalajs_react_vdom_PackageBase.prototype = new $h_Ljapgolly_scalajs_react_vdom_Exports();
$c_Ljapgolly_scalajs_react_vdom_PackageBase.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_PackageBase;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_PackageBase() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_PackageBase.prototype = $c_Ljapgolly_scalajs_react_vdom_PackageBase.prototype;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream() {
  $c_Ljava_io_PrintStream.call(this);
  this.isErr$4 = null;
  this.flushed$4 = false;
  this.buffer$4 = null
}
$c_jl_JSConsoleBasedPrintStream.prototype = new $h_Ljava_io_PrintStream();
$c_jl_JSConsoleBasedPrintStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream.prototype = $c_jl_JSConsoleBasedPrintStream.prototype;
$c_jl_JSConsoleBasedPrintStream.prototype.init___jl_Boolean = (function(isErr) {
  this.isErr$4 = isErr;
  var out = new $c_jl_JSConsoleBasedPrintStream$DummyOutputStream().init___();
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset.call(this, out, false, null);
  this.flushed$4 = true;
  this.buffer$4 = "";
  return this
});
$c_jl_JSConsoleBasedPrintStream.prototype.print__T__V = (function(s) {
  this.java$lang$JSConsoleBasedPrintStream$$printString__T__V(((s === null) ? "null" : s))
});
$c_jl_JSConsoleBasedPrintStream.prototype.java$lang$JSConsoleBasedPrintStream$$printString__T__V = (function(s) {
  var rest = s;
  while ((rest !== "")) {
    var thiz = rest;
    var nlPos = $uI(thiz.indexOf("\n"));
    if ((nlPos < 0)) {
      this.buffer$4 = (("" + this.buffer$4) + rest);
      this.flushed$4 = false;
      rest = ""
    } else {
      var jsx$1 = this.buffer$4;
      var thiz$1 = rest;
      this.doWriteLine__p4__T__V((("" + jsx$1) + $as_T(thiz$1.substring(0, nlPos))));
      this.buffer$4 = "";
      this.flushed$4 = true;
      var thiz$2 = rest;
      var beginIndex = ((1 + nlPos) | 0);
      rest = $as_T(thiz$2.substring(beginIndex))
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.doWriteLine__p4__T__V = (function(line) {
  var x = $g.console;
  if ($uZ((!(!x)))) {
    var x$1 = this.isErr$4;
    if ($uZ(x$1)) {
      var x$2 = $g.console.error;
      var jsx$1 = $uZ((!(!x$2)))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      $g.console.error(line)
    } else {
      $g.console.log(line)
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.close__V = (function() {
  /*<skip>*/
});
var $d_jl_JSConsoleBasedPrintStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream", {
  jl_JSConsoleBasedPrintStream: 1,
  Ljava_io_PrintStream: 1,
  Ljava_io_FilterOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  jl_AutoCloseable: 1,
  Ljava_io_Flushable: 1,
  jl_Appendable: 1
});
$c_jl_JSConsoleBasedPrintStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $c_s_UninitializedFieldError() {
  $c_jl_RuntimeException.call(this);
  this.msg$4 = null
}
$c_s_UninitializedFieldError.prototype = new $h_jl_RuntimeException();
$c_s_UninitializedFieldError.prototype.constructor = $c_s_UninitializedFieldError;
/** @constructor */
function $h_s_UninitializedFieldError() {
  /*<skip>*/
}
$h_s_UninitializedFieldError.prototype = $c_s_UninitializedFieldError.prototype;
$c_s_UninitializedFieldError.prototype.productPrefix__T = (function() {
  return "UninitializedFieldError"
});
$c_s_UninitializedFieldError.prototype.productArity__I = (function() {
  return 1
});
$c_s_UninitializedFieldError.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_UninitializedFieldError(x$1)) {
    var UninitializedFieldError$1 = $as_s_UninitializedFieldError(x$1);
    return (this.msg$4 === UninitializedFieldError$1.msg$4)
  } else {
    return false
  }
});
$c_s_UninitializedFieldError.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.msg$4;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_UninitializedFieldError.prototype.init___T = (function(msg) {
  this.msg$4 = msg;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, msg, null);
  return this
});
$c_s_UninitializedFieldError.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_UninitializedFieldError.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_UninitializedFieldError(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_UninitializedFieldError)))
}
function $as_s_UninitializedFieldError(obj) {
  return (($is_s_UninitializedFieldError(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.UninitializedFieldError"))
}
function $isArrayOf_s_UninitializedFieldError(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_UninitializedFieldError)))
}
function $asArrayOf_s_UninitializedFieldError(obj, depth) {
  return (($isArrayOf_s_UninitializedFieldError(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.UninitializedFieldError;", depth))
}
var $d_s_UninitializedFieldError = new $TypeData().initClass({
  s_UninitializedFieldError: 0
}, false, "scala.UninitializedFieldError", {
  s_UninitializedFieldError: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1
});
$c_s_UninitializedFieldError.prototype.$classData = $d_s_UninitializedFieldError;
/** @constructor */
function $c_s_math_Ordering$Int$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Int$.prototype = new $h_O();
$c_s_math_Ordering$Int$.prototype.constructor = $c_s_math_Ordering$Int$;
/** @constructor */
function $h_s_math_Ordering$Int$() {
  /*<skip>*/
}
$h_s_math_Ordering$Int$.prototype = $c_s_math_Ordering$Int$.prototype;
$c_s_math_Ordering$Int$.prototype.init___ = (function() {
  return this
});
$c_s_math_Ordering$Int$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return ((x$1 === y$1) ? 0 : ((x$1 < y$1) ? (-1) : 1))
});
var $d_s_math_Ordering$Int$ = new $TypeData().initClass({
  s_math_Ordering$Int$: 0
}, false, "scala.math.Ordering$Int$", {
  s_math_Ordering$Int$: 1,
  O: 1,
  s_math_Ordering$IntOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Int$.prototype.$classData = $d_s_math_Ordering$Int$;
var $n_s_math_Ordering$Int$ = (void 0);
function $m_s_math_Ordering$Int$() {
  if ((!$n_s_math_Ordering$Int$)) {
    $n_s_math_Ordering$Int$ = new $c_s_math_Ordering$Int$().init___()
  };
  return $n_s_math_Ordering$Int$
}
/** @constructor */
function $c_s_math_Ordering$String$() {
  $c_O.call(this)
}
$c_s_math_Ordering$String$.prototype = new $h_O();
$c_s_math_Ordering$String$.prototype.constructor = $c_s_math_Ordering$String$;
/** @constructor */
function $h_s_math_Ordering$String$() {
  /*<skip>*/
}
$h_s_math_Ordering$String$.prototype = $c_s_math_Ordering$String$.prototype;
$c_s_math_Ordering$String$.prototype.init___ = (function() {
  return this
});
$c_s_math_Ordering$String$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $as_T(x);
  var y$1 = $as_T(y);
  return ((x$1 === y$1) ? 0 : ($uZ((x$1 < y$1)) ? (-1) : 1))
});
var $d_s_math_Ordering$String$ = new $TypeData().initClass({
  s_math_Ordering$String$: 0
}, false, "scala.math.Ordering$String$", {
  s_math_Ordering$String$: 1,
  O: 1,
  s_math_Ordering$StringOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$String$.prototype.$classData = $d_s_math_Ordering$String$;
var $n_s_math_Ordering$String$ = (void 0);
function $m_s_math_Ordering$String$() {
  if ((!$n_s_math_Ordering$String$)) {
    $n_s_math_Ordering$String$ = new $c_s_math_Ordering$String$().init___()
  };
  return $n_s_math_Ordering$String$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ClassTypeManifest() {
  $c_O.call(this);
  this.prefix$1 = null;
  this.runtimeClass1$1 = null;
  this.typeArguments$1 = null
}
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype = new $h_O();
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype.constructor = $c_s_reflect_ManifestFactory$ClassTypeManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ClassTypeManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ClassTypeManifest.prototype = $c_s_reflect_ManifestFactory$ClassTypeManifest.prototype;
/** @constructor */
function $c_sc_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.ReusableCBF$6 = null
}
$c_sc_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sc_IndexedSeq$.prototype.constructor = $c_sc_IndexedSeq$;
/** @constructor */
function $h_sc_IndexedSeq$() {
  /*<skip>*/
}
$h_sc_IndexedSeq$.prototype = $c_sc_IndexedSeq$.prototype;
$c_sc_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_IndexedSeq$ = this;
  this.ReusableCBF$6 = new $c_sc_IndexedSeq$$anon$1().init___();
  return this
});
$c_sc_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$ = new $TypeData().initClass({
  sc_IndexedSeq$: 0
}, false, "scala.collection.IndexedSeq$", {
  sc_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_IndexedSeq$.prototype.$classData = $d_sc_IndexedSeq$;
var $n_sc_IndexedSeq$ = (void 0);
function $m_sc_IndexedSeq$() {
  if ((!$n_sc_IndexedSeq$)) {
    $n_sc_IndexedSeq$ = new $c_sc_IndexedSeq$().init___()
  };
  return $n_sc_IndexedSeq$
}
/** @constructor */
function $c_sc_IndexedSeqLike$Elements() {
  $c_sc_AbstractIterator.call(this);
  this.end$2 = 0;
  this.index$2 = 0;
  this.$$outer$2 = null
}
$c_sc_IndexedSeqLike$Elements.prototype = new $h_sc_AbstractIterator();
$c_sc_IndexedSeqLike$Elements.prototype.constructor = $c_sc_IndexedSeqLike$Elements;
/** @constructor */
function $h_sc_IndexedSeqLike$Elements() {
  /*<skip>*/
}
$h_sc_IndexedSeqLike$Elements.prototype = $c_sc_IndexedSeqLike$Elements.prototype;
$c_sc_IndexedSeqLike$Elements.prototype.next__O = (function() {
  if ((this.index$2 >= this.end$2)) {
    $m_sc_Iterator$().empty$1.next__O()
  };
  var x = this.$$outer$2.apply__I__O(this.index$2);
  this.index$2 = ((1 + this.index$2) | 0);
  return x
});
$c_sc_IndexedSeqLike$Elements.prototype.init___sc_IndexedSeqLike__I__I = (function($$outer, start, end) {
  this.end$2 = end;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.index$2 = start;
  return this
});
$c_sc_IndexedSeqLike$Elements.prototype.hasNext__Z = (function() {
  return (this.index$2 < this.end$2)
});
var $d_sc_IndexedSeqLike$Elements = new $TypeData().initClass({
  sc_IndexedSeqLike$Elements: 0
}, false, "scala.collection.IndexedSeqLike$Elements", {
  sc_IndexedSeqLike$Elements: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_BufferedIterator: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sc_IndexedSeqLike$Elements.prototype.$classData = $d_sc_IndexedSeqLike$Elements;
/** @constructor */
function $c_sci_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this)
}
$c_sci_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_IndexedSeq$.prototype.constructor = $c_sci_IndexedSeq$;
/** @constructor */
function $h_sci_IndexedSeq$() {
  /*<skip>*/
}
$h_sci_IndexedSeq$.prototype = $c_sci_IndexedSeq$.prototype;
$c_sci_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_IndexedSeq$ = new $TypeData().initClass({
  sci_IndexedSeq$: 0
}, false, "scala.collection.immutable.IndexedSeq$", {
  sci_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_IndexedSeq$.prototype.$classData = $d_sci_IndexedSeq$;
var $n_sci_IndexedSeq$ = (void 0);
function $m_sci_IndexedSeq$() {
  if ((!$n_sci_IndexedSeq$)) {
    $n_sci_IndexedSeq$ = new $c_sci_IndexedSeq$().init___()
  };
  return $n_sci_IndexedSeq$
}
/** @constructor */
function $c_sjs_js_JavaScriptException() {
  $c_jl_RuntimeException.call(this);
  this.exception$4 = null
}
$c_sjs_js_JavaScriptException.prototype = new $h_jl_RuntimeException();
$c_sjs_js_JavaScriptException.prototype.constructor = $c_sjs_js_JavaScriptException;
/** @constructor */
function $h_sjs_js_JavaScriptException() {
  /*<skip>*/
}
$h_sjs_js_JavaScriptException.prototype = $c_sjs_js_JavaScriptException.prototype;
$c_sjs_js_JavaScriptException.prototype.productPrefix__T = (function() {
  return "JavaScriptException"
});
$c_sjs_js_JavaScriptException.prototype.productArity__I = (function() {
  return 1
});
$c_sjs_js_JavaScriptException.prototype.fillInStackTrace__jl_Throwable = (function() {
  var e = this.exception$4;
  this.stackdata = e;
  return this
});
$c_sjs_js_JavaScriptException.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_sjs_js_JavaScriptException(x$1)) {
    var JavaScriptException$1 = $as_sjs_js_JavaScriptException(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.exception$4, JavaScriptException$1.exception$4)
  } else {
    return false
  }
});
$c_sjs_js_JavaScriptException.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.exception$4;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sjs_js_JavaScriptException.prototype.getMessage__T = (function() {
  return $objectToString(this.exception$4)
});
$c_sjs_js_JavaScriptException.prototype.init___O = (function(exception) {
  this.exception$4 = exception;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_sjs_js_JavaScriptException.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_sjs_js_JavaScriptException.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_sjs_js_JavaScriptException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_JavaScriptException)))
}
function $as_sjs_js_JavaScriptException(obj) {
  return (($is_sjs_js_JavaScriptException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.JavaScriptException"))
}
function $isArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_JavaScriptException)))
}
function $asArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (($isArrayOf_sjs_js_JavaScriptException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.JavaScriptException;", depth))
}
var $d_sjs_js_JavaScriptException = new $TypeData().initClass({
  sjs_js_JavaScriptException: 0
}, false, "scala.scalajs.js.JavaScriptException", {
  sjs_js_JavaScriptException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1
});
$c_sjs_js_JavaScriptException.prototype.$classData = $d_sjs_js_JavaScriptException;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate() {
  $c_O.call(this);
  this.raw$1 = null;
  this.prevProps$1 = null;
  this.prevState$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((((((("ComponentDidUpdate(props: " + this.prevProps$1) + " \u2192 ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).props__O()) + ", state: ") + this.prevState$1) + " \u2192 ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).state__O()) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype.init___Ljapgolly_scalajs_react_raw_React$Component__O__O = (function(raw, prevProps, prevState) {
  this.raw$1 = raw;
  this.prevProps$1 = prevProps;
  this.prevState$1 = prevState;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentDidUpdate", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ForceUpdate: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidUpdate;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount() {
  $c_O.call(this);
  this.raw$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$().equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z(this.raw$1, x$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount$().toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T(this.raw$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.init___Ljapgolly_scalajs_react_raw_React$Component = (function(raw) {
  this.raw$1 = raw;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.hashCode__I = (function() {
  var $$this = this.raw$1;
  return $objectHashCode($$this)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
function $is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount)))
}
function $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj) {
  return (($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillMount"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.builder.Lifecycle$ComponentWillMount;", depth))
}
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillMount", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateRW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillMount;
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_PackageBase$() {
  $c_Ljapgolly_scalajs_react_vdom_PackageBase.call(this)
}
$c_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype = new $h_Ljapgolly_scalajs_react_vdom_PackageBase();
$c_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_PackageBase$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_PackageBase$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype = $c_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype;
$c_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype.init___ = (function() {
  $c_Ljapgolly_scalajs_react_vdom_Exports.prototype.init___.call(this);
  $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1__$$init$__V(this);
  $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr__$$init$__V(this);
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_PackageBase$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_PackageBase$: 0
}, false, "japgolly.scalajs.react.vdom.PackageBase$", {
  Ljapgolly_scalajs_react_vdom_PackageBase$: 1,
  Ljapgolly_scalajs_react_vdom_PackageBase: 1,
  Ljapgolly_scalajs_react_vdom_Exports: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Implicits: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForTagMod: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomNode: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomElement: 1
});
$c_Ljapgolly_scalajs_react_vdom_PackageBase$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_PackageBase$;
var $n_Ljapgolly_scalajs_react_vdom_PackageBase$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_PackageBase$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_PackageBase$)) {
    $n_Ljapgolly_scalajs_react_vdom_PackageBase$ = new $c_Ljapgolly_scalajs_react_vdom_PackageBase$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_PackageBase$
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_vdom_html$und$less$up$() {
  $c_Ljapgolly_scalajs_react_vdom_PackageBase.call(this);
  this.$$less$3 = null;
  this.$$up$3 = null
}
$c_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype = new $h_Ljapgolly_scalajs_react_vdom_PackageBase();
$c_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype.constructor = $c_Ljapgolly_scalajs_react_vdom_html$und$less$up$;
/** @constructor */
function $h_Ljapgolly_scalajs_react_vdom_html$und$less$up$() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype = $c_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype;
$c_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype.init___ = (function() {
  $c_Ljapgolly_scalajs_react_vdom_Exports.prototype.init___.call(this);
  $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1__$$init$__V(this);
  $f_Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr__$$init$__V(this);
  $n_Ljapgolly_scalajs_react_vdom_html$und$less$up$ = this;
  this.$$less$3 = $m_Ljapgolly_scalajs_react_vdom_HtmlTags$();
  this.$$up$3 = $m_Ljapgolly_scalajs_react_vdom_HtmlAttrAndStyles$();
  return this
});
var $d_Ljapgolly_scalajs_react_vdom_html$und$less$up$ = new $TypeData().initClass({
  Ljapgolly_scalajs_react_vdom_html$und$less$up$: 0
}, false, "japgolly.scalajs.react.vdom.html_$less$up$", {
  Ljapgolly_scalajs_react_vdom_html$und$less$up$: 1,
  Ljapgolly_scalajs_react_vdom_PackageBase: 1,
  Ljapgolly_scalajs_react_vdom_Exports: 1,
  O: 1,
  Ljapgolly_scalajs_react_vdom_Implicits: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForTagMod: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomAttr1: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomNode: 1,
  Ljapgolly_scalajs_react_vdom_ImplicitsForVdomElement: 1
});
$c_Ljapgolly_scalajs_react_vdom_html$und$less$up$.prototype.$classData = $d_Ljapgolly_scalajs_react_vdom_html$und$less$up$;
var $n_Ljapgolly_scalajs_react_vdom_html$und$less$up$ = (void 0);
function $m_Ljapgolly_scalajs_react_vdom_html$und$less$up$() {
  if ((!$n_Ljapgolly_scalajs_react_vdom_html$und$less$up$)) {
    $n_Ljapgolly_scalajs_react_vdom_html$und$less$up$ = new $c_Ljapgolly_scalajs_react_vdom_html$und$less$up$().init___()
  };
  return $n_Ljapgolly_scalajs_react_vdom_html$und$less$up$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$PhantomManifest() {
  $c_s_reflect_ManifestFactory$ClassTypeManifest.call(this);
  this.toString$2 = null
}
$c_s_reflect_ManifestFactory$PhantomManifest.prototype = new $h_s_reflect_ManifestFactory$ClassTypeManifest();
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.constructor = $c_s_reflect_ManifestFactory$PhantomManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$PhantomManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$PhantomManifest.prototype = $c_s_reflect_ManifestFactory$PhantomManifest.prototype;
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.toString__T = (function() {
  return this.toString$2
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
function $f_sc_IterableLike__sameElements__sc_GenIterable__Z($thiz, that) {
  var these = $thiz.iterator__sc_Iterator();
  var those = that.iterator__sc_Iterator();
  while ((these.hasNext__Z() && those.hasNext__Z())) {
    if ((!$m_sr_BoxesRunTime$().equals__O__O__Z(these.next__O(), those.next__O()))) {
      return false
    }
  };
  return ((!these.hasNext__Z()) && (!those.hasNext__Z()))
}
function $f_sc_IterableLike__zipWithIndex__scg_CanBuildFrom__O($thiz, bf) {
  var b = bf.apply__O__scm_Builder($thiz.repr__O());
  var i = new $c_sr_IntRef().init___I(0);
  $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, b$1, i$1) {
    return (function(x$2) {
      b$1.$$plus$eq__O__scm_Builder(new $c_T2().init___O__O(x$2, i$1.elem$1));
      i$1.elem$1 = ((1 + i$1.elem$1) | 0)
    })
  })($thiz, b, i)));
  return b.result__O()
}
function $f_sc_IterableLike__take__I__O($thiz, n) {
  var b = $thiz.newBuilder__scm_Builder();
  if ((n <= 0)) {
    return b.result__O()
  } else {
    b.sizeHintBounded__I__sc_TraversableLike__V(n, $thiz);
    var i = 0;
    var it = $thiz.iterator__sc_Iterator();
    while (((i < n) && it.hasNext__Z())) {
      b.$$plus$eq__O__scm_Builder(it.next__O());
      i = ((1 + i) | 0)
    };
    return b.result__O()
  }
}
function $f_sc_IterableLike__copyToArray__O__I__I__V($thiz, xs, start, len) {
  var i = start;
  var x = ((start + len) | 0);
  var that = $m_sr_ScalaRunTime$().array$undlength__O__I(xs);
  var end = ((x < that) ? x : that);
  var it = $thiz.iterator__sc_Iterator();
  while (((i < end) && it.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, it.next__O());
    i = ((1 + i) | 0)
  }
}
/** @constructor */
function $c_sci_List$() {
  $c_scg_SeqFactory.call(this);
  this.partialNotApplied$5 = null
}
$c_sci_List$.prototype = new $h_scg_SeqFactory();
$c_sci_List$.prototype.constructor = $c_sci_List$;
/** @constructor */
function $h_sci_List$() {
  /*<skip>*/
}
$h_sci_List$.prototype = $c_sci_List$.prototype;
$c_sci_List$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sci_List$ = this;
  this.partialNotApplied$5 = new $c_sci_List$$anon$1().init___();
  return this
});
$c_sci_List$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Nil$()
});
$c_sci_List$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_List$ = new $TypeData().initClass({
  sci_List$: 0
}, false, "scala.collection.immutable.List$", {
  sci_List$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_List$.prototype.$classData = $d_sci_List$;
var $n_sci_List$ = (void 0);
function $m_sci_List$() {
  if ((!$n_sci_List$)) {
    $n_sci_List$ = new $c_sci_List$().init___()
  };
  return $n_sci_List$
}
/** @constructor */
function $c_sci_Stream$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Stream$.prototype = new $h_scg_SeqFactory();
$c_sci_Stream$.prototype.constructor = $c_sci_Stream$;
/** @constructor */
function $h_sci_Stream$() {
  /*<skip>*/
}
$h_sci_Stream$.prototype = $c_sci_Stream$.prototype;
$c_sci_Stream$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Stream$.prototype.filteredTail__sci_Stream__F1__Z__sci_Stream$Cons = (function(stream, p, isFlipped) {
  var hd = stream.head__O();
  var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, stream$1, p$1, isFlipped$1) {
    return (function() {
      return $as_sci_Stream(stream$1.tail__O()).filterImpl__F1__Z__sci_Stream(p$1, isFlipped$1)
    })
  })(this, stream, p, isFlipped));
  return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
});
$c_sci_Stream$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Stream$Empty$()
});
$c_sci_Stream$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_Stream$StreamBuilder().init___()
});
var $d_sci_Stream$ = new $TypeData().initClass({
  sci_Stream$: 0
}, false, "scala.collection.immutable.Stream$", {
  sci_Stream$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$.prototype.$classData = $d_sci_Stream$;
var $n_sci_Stream$ = (void 0);
function $m_sci_Stream$() {
  if ((!$n_sci_Stream$)) {
    $n_sci_Stream$ = new $c_sci_Stream$().init___()
  };
  return $n_sci_Stream$
}
/** @constructor */
function $c_scm_ArrayBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ArrayBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ArrayBuffer$.prototype.constructor = $c_scm_ArrayBuffer$;
/** @constructor */
function $h_scm_ArrayBuffer$() {
  /*<skip>*/
}
$h_scm_ArrayBuffer$.prototype = $c_scm_ArrayBuffer$.prototype;
$c_scm_ArrayBuffer$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_ArrayBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_ArrayBuffer$ = new $TypeData().initClass({
  scm_ArrayBuffer$: 0
}, false, "scala.collection.mutable.ArrayBuffer$", {
  scm_ArrayBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer$.prototype.$classData = $d_scm_ArrayBuffer$;
var $n_scm_ArrayBuffer$ = (void 0);
function $m_scm_ArrayBuffer$() {
  if ((!$n_scm_ArrayBuffer$)) {
    $n_scm_ArrayBuffer$ = new $c_scm_ArrayBuffer$().init___()
  };
  return $n_scm_ArrayBuffer$
}
/** @constructor */
function $c_scm_ListBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ListBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ListBuffer$.prototype.constructor = $c_scm_ListBuffer$;
/** @constructor */
function $h_scm_ListBuffer$() {
  /*<skip>*/
}
$h_scm_ListBuffer$.prototype = $c_scm_ListBuffer$.prototype;
$c_scm_ListBuffer$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_ListBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_ListBuffer().init___())
});
var $d_scm_ListBuffer$ = new $TypeData().initClass({
  scm_ListBuffer$: 0
}, false, "scala.collection.mutable.ListBuffer$", {
  scm_ListBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer$.prototype.$classData = $d_scm_ListBuffer$;
var $n_scm_ListBuffer$ = (void 0);
function $m_scm_ListBuffer$() {
  if ((!$n_scm_ListBuffer$)) {
    $n_scm_ListBuffer$ = new $c_scm_ListBuffer$().init___()
  };
  return $n_scm_ListBuffer$
}
function $is_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_Js$MountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.Js$MountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_Js$MountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_Js$MountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.Js$MountedWithRoot;", depth))
}
function $is_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_Scala$MountedWithRoot)))
}
function $as_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj) {
  return (($is_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.Scala$MountedWithRoot"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_Scala$MountedWithRoot)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.Scala$MountedWithRoot;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Template$MountedMapped() {
  $c_O.call(this);
  this.from$1 = null;
  this.mp$1 = null;
  this.ls$1 = null;
  this.ft$1 = null
}
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Template$MountedMapped;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Template$MountedMapped() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype = $c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype;
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.withEffect__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(t) {
  return this.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(this.mp$1, this.ls$1, this.ft$1.compose__Ljapgolly_scalajs_react_internal_Effect$Trans__s_Predef$$less$colon$less__Ljapgolly_scalajs_react_internal_Effect$Trans(t, null))
});
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.props__O = (function() {
  return this.ft$1.apply__F0__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $this.mp$1.apply__O__O($this.from$1.props__O())
    })
  })(this)))
});
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.modState__F1__F0__O = (function(f, callback) {
  return this.ft$1.apply__F0__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1, callback$1) {
    return (function() {
      $this.from$1.modState__F1__F0__O($as_F1($this.ls$1.mod$1.apply__O__O(f$1)), callback$1)
    })
  })(this, f, callback)))
});
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans = (function(from, mp, ls, ft) {
  this.from$1 = from;
  this.mp$1 = mp;
  this.ls$1 = ls;
  this.ft$1 = ft;
  return this
});
$c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.state__O = (function() {
  return this.ft$1.apply__F0__O(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $this.ls$1.get$1.apply__O__O($this.from$1.state__O())
    })
  })(this)))
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot() {
  $c_O.call(this);
  this.ft$1 = null
}
$c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Template$MountedWithRoot() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype = $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype;
$c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype.withEffect__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(t) {
  var jsx$1 = $m_Ljapgolly_scalajs_react_internal_package$().identityFnInstance$1;
  var this$1 = $m_Ljapgolly_scalajs_react_internal_Lens$();
  return this.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot(jsx$1, this$1.idInstance$1, this.ft$1.compose__Ljapgolly_scalajs_react_internal_Effect$Trans__s_Predef$$less$colon$less__Ljapgolly_scalajs_react_internal_Effect$Trans(t, null))
});
$c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype.init___Ljapgolly_scalajs_react_internal_Effect$Trans = (function(ft) {
  this.ft$1 = ft;
  return this
});
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch() {
  $c_O.call(this);
  this.raw$1 = null;
  this.error$1 = null;
  this.info$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((("ComponentDidCatch(" + this.error$1) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype.init___Ljapgolly_scalajs_react_raw_React$Component__Ljapgolly_scalajs_react_raw_React$Error__Ljapgolly_scalajs_react_raw_React$ErrorInfo = (function(raw, error, info) {
  this.raw$1 = raw;
  this.error$1 = error;
  this.info$1 = info;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentDidCatch", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateRW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ForceUpdate: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidCatch;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount() {
  $c_O.call(this);
  this.raw$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$().equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z(this.raw$1, x$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount$().toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T(this.raw$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.init___Ljapgolly_scalajs_react_raw_React$Component = (function(raw) {
  this.raw$1 = raw;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.hashCode__I = (function() {
  var $$this = this.raw$1;
  return $objectHashCode($$this)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
function $is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount)))
}
function $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj) {
  return (($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentDidMount"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.builder.Lifecycle$ComponentDidMount;", depth))
}
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentDidMount", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateRW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ForceUpdate: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentDidMount;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps() {
  $c_O.call(this);
  this.raw$1 = null;
  this.nextProps$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype.init___Ljapgolly_scalajs_react_raw_React$Component__O = (function(raw, nextProps) {
  this.raw$1 = raw;
  this.nextProps$1 = nextProps;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$().japgolly$scalajs$react$component$builder$Lifecycle$$wrapTostring__T__T((((((("ComponentWillReceiveProps(props: " + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).props__O()) + " \u2192 ") + this.nextProps$1) + ", state: ") + $f_Ljapgolly_scalajs_react_component_builder_Lifecycle$Base__mountedImpure__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(this).state__O()) + ")"))
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$ComponentWillReceiveProps", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateRW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ForceUpdate: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$ComponentWillReceiveProps;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope() {
  $c_O.call(this);
  this.raw$1 = null
}
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype = new $h_O();
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.constructor = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype = $c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype;
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.equals__O__Z = (function(x$1) {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().equals$extension__Ljapgolly_scalajs_react_raw_React$Component__O__Z(this.raw$1, x$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.toString__T = (function() {
  return $m_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope$().toString$extension__Ljapgolly_scalajs_react_raw_React$Component__T(this.raw$1)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.init___Ljapgolly_scalajs_react_raw_React$Component = (function(raw) {
  this.raw$1 = raw;
  return this
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.hashCode__I = (function() {
  var $$this = this.raw$1;
  return $objectHashCode($$this)
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$1
});
function $is_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope)))
}
function $as_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj) {
  return (($is_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "japgolly.scalajs.react.component.builder.Lifecycle$RenderScope"))
}
function $isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope)))
}
function $asArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj, depth) {
  return (($isArrayOf_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljapgolly.scalajs.react.component.builder.Lifecycle$RenderScope;", depth))
}
var $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope: 0
}, false, "japgolly.scalajs.react.component.builder.Lifecycle$RenderScope", {
  Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateRW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$StateW: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$Base: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_builder_Lifecycle$ForceUpdate: 1
});
$c_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope.prototype.$classData = $d_Ljapgolly_scalajs_react_component_builder_Lifecycle$RenderScope;
/** @constructor */
function $c_s_reflect_ManifestFactory$ObjectManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ObjectManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ObjectManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ObjectManifest$.prototype = $c_s_reflect_ManifestFactory$ObjectManifest$.prototype;
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.init___ = (function() {
  this.toString$2 = "Object";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
var $d_s_reflect_ManifestFactory$ObjectManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ObjectManifest$: 0
}, false, "scala.reflect.ManifestFactory$ObjectManifest$", {
  s_reflect_ManifestFactory$ObjectManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ObjectManifest$;
var $n_s_reflect_ManifestFactory$ObjectManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ObjectManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ObjectManifest$)) {
    $n_s_reflect_ManifestFactory$ObjectManifest$ = new $c_s_reflect_ManifestFactory$ObjectManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ObjectManifest$
}
function $is_sc_GenMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenMap)))
}
function $as_sc_GenMap(obj) {
  return (($is_sc_GenMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenMap"))
}
function $isArrayOf_sc_GenMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenMap)))
}
function $asArrayOf_sc_GenMap(obj, depth) {
  return (($isArrayOf_sc_GenMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenMap;", depth))
}
function $is_sc_GenSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSeq)))
}
function $as_sc_GenSeq(obj) {
  return (($is_sc_GenSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSeq"))
}
function $isArrayOf_sc_GenSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSeq)))
}
function $asArrayOf_sc_GenSeq(obj, depth) {
  return (($isArrayOf_sc_GenSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSeq;", depth))
}
/** @constructor */
function $c_sci_Vector$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.NIL$6 = null
}
$c_sci_Vector$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_Vector$.prototype.constructor = $c_sci_Vector$;
/** @constructor */
function $h_sci_Vector$() {
  /*<skip>*/
}
$h_sci_Vector$.prototype = $c_sci_Vector$.prototype;
$c_sci_Vector$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sci_Vector$ = this;
  this.NIL$6 = new $c_sci_Vector().init___I__I__I(0, 0, 0);
  return this
});
$c_sci_Vector$.prototype.empty__sc_GenTraversable = (function() {
  return this.NIL$6
});
$c_sci_Vector$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_Vector$ = new $TypeData().initClass({
  sci_Vector$: 0
}, false, "scala.collection.immutable.Vector$", {
  sci_Vector$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Vector$.prototype.$classData = $d_sci_Vector$;
var $n_sci_Vector$ = (void 0);
function $m_sci_Vector$() {
  if ((!$n_sci_Vector$)) {
    $n_sci_Vector$ = new $c_sci_Vector$().init___()
  };
  return $n_sci_Vector$
}
/** @constructor */
function $c_sc_AbstractTraversable() {
  $c_O.call(this)
}
$c_sc_AbstractTraversable.prototype = new $h_O();
$c_sc_AbstractTraversable.prototype.constructor = $c_sc_AbstractTraversable;
/** @constructor */
function $h_sc_AbstractTraversable() {
  /*<skip>*/
}
$h_sc_AbstractTraversable.prototype = $c_sc_AbstractTraversable.prototype;
$c_sc_AbstractTraversable.prototype.copyToArray__O__I__V = (function(xs, start) {
  $f_sc_TraversableOnce__copyToArray__O__I__V(this, xs, start)
});
$c_sc_AbstractTraversable.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.withFilter__F1__scg_FilterMonadic = (function(p) {
  return new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this, p)
});
$c_sc_AbstractTraversable.prototype.toBuffer__scm_Buffer = (function() {
  var this$1 = $m_scm_ArrayBuffer$();
  var cbf = this$1.ReusableCBFInstance$2;
  return $as_scm_Buffer($f_sc_TraversableLike__to__scg_CanBuildFrom__O(this, cbf))
});
$c_sc_AbstractTraversable.prototype.size__I = (function() {
  return $f_sc_TraversableOnce__size__I(this)
});
$c_sc_AbstractTraversable.prototype.sizeHintIfCheap__I = (function() {
  return (-1)
});
$c_sc_AbstractTraversable.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.max__s_math_Ordering__O = (function(cmp) {
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this, cmp)
});
$c_sc_AbstractTraversable.prototype.repr__O = (function() {
  return this
});
$c_sc_AbstractTraversable.prototype.isTraversableAgain__Z = (function() {
  return true
});
$c_sc_AbstractTraversable.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O(this, evidence$1)
});
$c_sc_AbstractTraversable.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  return $f_sc_TraversableLike__map__F1__scg_CanBuildFrom__O(this, f, bf)
});
$c_sc_AbstractTraversable.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_TraversableOnce__reduceLeft__F2__O(this, op)
});
$c_sc_AbstractTraversable.prototype.newBuilder__scm_Builder = (function() {
  return this.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_sc_AbstractTraversable.prototype.stringPrefix__T = (function() {
  return $f_sc_TraversableLike__stringPrefix__T(this)
});
function $f_sc_SeqLike__isEmpty__Z($thiz) {
  return ($thiz.lengthCompare__I__I(0) === 0)
}
function $f_sc_SeqLike__sorted__s_math_Ordering__O($thiz, ord) {
  var len = $thiz.length__I();
  var b = $thiz.newBuilder__scm_Builder();
  if ((len === 1)) {
    b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($thiz)
  } else if ((len > 1)) {
    b.sizeHint__I__V(len);
    var arr = $newArrayObject($d_O.getArrayOf(), [len]);
    var i = new $c_sr_IntRef().init___I(0);
    $thiz.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, arr$1, i$1) {
      return (function(x$2) {
        arr$1.set(i$1.elem$1, x$2);
        i$1.elem$1 = ((1 + i$1.elem$1) | 0)
      })
    })($thiz, arr, i)));
    $m_ju_Arrays$().sort__AO__ju_Comparator__V(arr, ord);
    i.elem$1 = 0;
    while ((i.elem$1 < arr.u.length)) {
      b.$$plus$eq__O__scm_Builder(arr.get(i.elem$1));
      i.elem$1 = ((1 + i.elem$1) | 0)
    }
  };
  return b.result__O()
}
function $f_sc_SeqLike__$$colon$plus__O__scg_CanBuildFrom__O($thiz, elem, bf) {
  var b = bf.apply__O__scm_Builder($thiz.repr__O());
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($thiz.thisCollection__sc_Seq());
  b.$$plus$eq__O__scm_Builder(elem);
  return b.result__O()
}
function $f_sc_SeqLike__sortBy__F1__s_math_Ordering__O($thiz, f, ord) {
  var ord$1 = new $c_s_math_Ordering$$anon$5().init___s_math_Ordering__F1(ord, f);
  return $f_sc_SeqLike__sorted__s_math_Ordering__O($thiz, ord$1)
}
function $f_sc_IndexedSeqLike__toBuffer__scm_Buffer($thiz) {
  var result = new $c_scm_ArrayBuffer().init___I($thiz.size__I());
  var xs = $thiz.seq__sc_TraversableOnce();
  result.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer(xs);
  return result
}
function $is_sc_IndexedSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeqLike)))
}
function $as_sc_IndexedSeqLike(obj) {
  return (($is_sc_IndexedSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeqLike"))
}
function $isArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeqLike)))
}
function $asArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (($isArrayOf_sc_IndexedSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeqLike;", depth))
}
function $is_sc_LinearSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqLike)))
}
function $as_sc_LinearSeqLike(obj) {
  return (($is_sc_LinearSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqLike"))
}
function $isArrayOf_sc_LinearSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqLike)))
}
function $asArrayOf_sc_LinearSeqLike(obj, depth) {
  return (($isArrayOf_sc_LinearSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqLike;", depth))
}
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Js$$anon$1() {
  $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.call(this);
  this.raw$2 = null
}
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype = new $h_Ljapgolly_scalajs_react_component_Template$MountedWithRoot();
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Js$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Js$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype = $c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.modState__F1__F0__V = (function(mod, callback) {
  var jsFn1 = (function(f) {
    return (function(arg1) {
      return f.apply__O__O(arg1)
    })
  })(mod);
  this.raw$2.setState(jsFn1, $m_Ljapgolly_scalajs_react_CallbackTo$().toJsFn$extension__F0__sjs_js_Function0(callback))
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(mp, ls, ft) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$2().init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans(this, mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.props__sjs_js_Object = (function() {
  return this.raw$2.props
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.props__O = (function() {
  return this.props__sjs_js_Object()
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.modState__F1__F0__O = (function(mod, callback) {
  this.modState__F1__F0__V(mod, callback)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.init___Ljapgolly_scalajs_react_raw_React$Component = (function(r$2) {
  $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype.init___Ljapgolly_scalajs_react_internal_Effect$Trans.call(this, $m_Ljapgolly_scalajs_react_internal_Effect$Trans$().endoId$1);
  this.raw$2 = r$2;
  return this
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.state__O = (function() {
  return this.state__sjs_js_Object()
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.state__sjs_js_Object = (function() {
  return this.raw$2.state
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$2
});
var $d_Ljapgolly_scalajs_react_component_Js$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Js$$anon$1: 0
}, false, "japgolly.scalajs.react.component.Js$$anon$1", {
  Ljapgolly_scalajs_react_component_Js$$anon$1: 1,
  Ljapgolly_scalajs_react_component_Template$MountedWithRoot: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedRaw: 1,
  Ljapgolly_scalajs_react_StateAccess: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_Js$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Js$MountedSimple: 1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Js$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Js$$anon$2() {
  $c_Ljapgolly_scalajs_react_component_Template$MountedMapped.call(this);
  this.raw$2 = null;
  this.from$2$2 = null;
  this.ft$1$2 = null
}
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype = new $h_Ljapgolly_scalajs_react_component_Template$MountedMapped();
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Js$$anon$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Js$$anon$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype = $c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype;
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Js$MountedWithRoot = (function(mp, ls, ft) {
  $m_Ljapgolly_scalajs_react_component_Js$();
  var from = this.from$2$2;
  return new $c_Ljapgolly_scalajs_react_component_Js$$anon$2().init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans(from, mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(mp, ls, ft) {
  return this.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Js$MountedWithRoot(mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans = (function(from$2, mp$2, ls$1, ft$1) {
  this.from$2$2 = from$2;
  this.ft$1$2 = ft$1;
  $c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans.call(this, from$2, mp$2, ls$1, ft$1);
  this.raw$2 = from$2.raw__Ljapgolly_scalajs_react_raw_React$Component();
  return this
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$2
});
var $d_Ljapgolly_scalajs_react_component_Js$$anon$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Js$$anon$2: 0
}, false, "japgolly.scalajs.react.component.Js$$anon$2", {
  Ljapgolly_scalajs_react_component_Js$$anon$2: 1,
  Ljapgolly_scalajs_react_component_Template$MountedMapped: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedRaw: 1,
  Ljapgolly_scalajs_react_StateAccess: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_Js$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Js$MountedSimple: 1
});
$c_Ljapgolly_scalajs_react_component_Js$$anon$2.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Js$$anon$2;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Scala$$anon$1() {
  $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.call(this);
  this.js$2 = null;
  this.raw$2 = null;
  this.x$1$2 = null
}
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype = new $h_Ljapgolly_scalajs_react_component_Template$MountedWithRoot();
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Scala$$anon$1;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Scala$$anon$1() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype = $c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype;
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.js__Ljapgolly_scalajs_react_component_Js$MountedWithRoot = (function() {
  return this.js$2
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.modState__F1__F0__V = (function(mod, callback) {
  this.x$1$2.modState__F1__F0__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, mod$1) {
    return (function(s$2) {
      $m_Ljapgolly_scalajs_react_internal_Box$();
      var value = mod$1.apply__O__O(s$2.a);
      return {
        "a": value
      }
    })
  })(this, mod)), callback)
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(mp, ls, ft) {
  $m_Ljapgolly_scalajs_react_component_Scala$();
  return new $c_Ljapgolly_scalajs_react_component_Scala$$anon$2().init___Ljapgolly_scalajs_react_component_Scala$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans(this, mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.props__O = (function() {
  return this.x$1$2.props__O().a
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.modState__F1__F0__O = (function(mod, callback) {
  this.modState__F1__F0__V(mod, callback)
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.state__O = (function() {
  return this.x$1$2.state__O().a
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.init___Ljapgolly_scalajs_react_component_Js$MountedWithRoot = (function(x$1) {
  this.x$1$2 = x$1;
  $c_Ljapgolly_scalajs_react_component_Template$MountedWithRoot.prototype.init___Ljapgolly_scalajs_react_internal_Effect$Trans.call(this, $m_Ljapgolly_scalajs_react_internal_Effect$Trans$().endoId$1);
  this.js$2 = x$1;
  this.raw$2 = x$1.raw__Ljapgolly_scalajs_react_raw_React$Component();
  return this
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$2
});
var $d_Ljapgolly_scalajs_react_component_Scala$$anon$1 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Scala$$anon$1: 0
}, false, "japgolly.scalajs.react.component.Scala$$anon$1", {
  Ljapgolly_scalajs_react_component_Scala$$anon$1: 1,
  Ljapgolly_scalajs_react_component_Template$MountedWithRoot: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedRaw: 1,
  Ljapgolly_scalajs_react_StateAccess: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_Scala$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Scala$MountedSimple: 1
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$1.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Scala$$anon$1;
/** @constructor */
function $c_Ljapgolly_scalajs_react_component_Scala$$anon$2() {
  $c_Ljapgolly_scalajs_react_component_Template$MountedMapped.call(this);
  this.js$2 = null;
  this.raw$2 = null;
  this.from$1$2 = null;
  this.ft$1$2 = null
}
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype = new $h_Ljapgolly_scalajs_react_component_Template$MountedMapped();
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.constructor = $c_Ljapgolly_scalajs_react_component_Scala$$anon$2;
/** @constructor */
function $h_Ljapgolly_scalajs_react_component_Scala$$anon$2() {
  /*<skip>*/
}
$h_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype = $c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype;
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.js__Ljapgolly_scalajs_react_component_Js$MountedWithRoot = (function() {
  return this.js$2
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.init___Ljapgolly_scalajs_react_component_Scala$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans = (function(from$1, mp$1, ls$1, ft$1) {
  this.from$1$2 = from$1;
  this.ft$1$2 = ft$1;
  $c_Ljapgolly_scalajs_react_component_Template$MountedMapped.prototype.init___Ljapgolly_scalajs_react_component_Generic$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans.call(this, from$1, mp$1, ls$1, ft$1);
  this.js$2 = from$1.js__Ljapgolly_scalajs_react_component_Js$MountedWithRoot();
  this.raw$2 = from$1.raw__Ljapgolly_scalajs_react_raw_React$Component();
  return this
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Generic$MountedWithRoot = (function(mp, ls, ft) {
  return this.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot(mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.mapped__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans__Ljapgolly_scalajs_react_component_Scala$MountedWithRoot = (function(mp, ls, ft) {
  $m_Ljapgolly_scalajs_react_component_Scala$();
  var from = this.from$1$2;
  return new $c_Ljapgolly_scalajs_react_component_Scala$$anon$2().init___Ljapgolly_scalajs_react_component_Scala$MountedWithRoot__F1__Ljapgolly_scalajs_react_internal_Lens__Ljapgolly_scalajs_react_internal_Effect$Trans(from, mp, ls, ft)
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.raw__Ljapgolly_scalajs_react_raw_React$Component = (function() {
  return this.raw$2
});
var $d_Ljapgolly_scalajs_react_component_Scala$$anon$2 = new $TypeData().initClass({
  Ljapgolly_scalajs_react_component_Scala$$anon$2: 0
}, false, "japgolly.scalajs.react.component.Scala$$anon$2", {
  Ljapgolly_scalajs_react_component_Scala$$anon$2: 1,
  Ljapgolly_scalajs_react_component_Template$MountedMapped: 1,
  O: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedSimple: 1,
  Ljapgolly_scalajs_react_component_Generic$MountedRaw: 1,
  Ljapgolly_scalajs_react_StateAccess: 1,
  Ljapgolly_scalajs_react_StateAccess$Write: 1,
  Ljapgolly_scalajs_react_StateAccess$SetState: 1,
  Ljapgolly_scalajs_react_StateAccess$ModState: 1,
  Ljapgolly_scalajs_react_StateAccess$WriteWithProps: 1,
  Ljapgolly_scalajs_react_StateAccess$ModStateWithProps: 1,
  Ljapgolly_scalajs_react_component_Scala$MountedWithRoot: 1,
  Ljapgolly_scalajs_react_component_Scala$MountedSimple: 1
});
$c_Ljapgolly_scalajs_react_component_Scala$$anon$2.prototype.$classData = $d_Ljapgolly_scalajs_react_component_Scala$$anon$2;
function $f_sc_IndexedSeqOptimized__lengthCompare__I__I($thiz, len) {
  return (($thiz.length__I() - len) | 0)
}
function $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z($thiz, that) {
  if ($is_sc_IndexedSeq(that)) {
    var x2 = $as_sc_IndexedSeq(that);
    var len = $thiz.length__I();
    if ((len === x2.length__I())) {
      var i = 0;
      while (((i < len) && $m_sr_BoxesRunTime$().equals__O__O__Z($thiz.apply__I__O(i), x2.apply__I__O(i)))) {
        i = ((1 + i) | 0)
      };
      return (i === len)
    } else {
      return false
    }
  } else {
    return $f_sc_IterableLike__sameElements__sc_GenIterable__Z($thiz, that)
  }
}
function $f_sc_IndexedSeqOptimized__isEmpty__Z($thiz) {
  return ($thiz.length__I() === 0)
}
function $f_sc_IndexedSeqOptimized__foreach__F1__V($thiz, f) {
  var i = 0;
  var len = $thiz.length__I();
  while ((i < len)) {
    f.apply__O__O($thiz.apply__I__O(i));
    i = ((1 + i) | 0)
  }
}
function $f_sc_IndexedSeqOptimized__foldl__psc_IndexedSeqOptimized__I__I__O__F2__O($thiz, start, end, z, op) {
  _foldl: while (true) {
    if ((start === end)) {
      return z
    } else {
      var temp$start = ((1 + start) | 0);
      var temp$z = op.apply__O__O__O(z, $thiz.apply__I__O(start));
      start = temp$start;
      z = temp$z;
      continue _foldl
    }
  }
}
function $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V($thiz, xs, start, len) {
  var i = 0;
  var j = start;
  var x = $thiz.length__I();
  var x$1 = ((x < len) ? x : len);
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = ((x$1 < that) ? x$1 : that);
  while ((i < end)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, j, $thiz.apply__I__O(i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
}
function $f_sc_IndexedSeqOptimized__reduceLeft__F2__O($thiz, op) {
  if (($thiz.length__I() > 0)) {
    var start = 1;
    var end = $thiz.length__I();
    var z = $thiz.apply__I__O(0);
    return $f_sc_IndexedSeqOptimized__foldl__psc_IndexedSeqOptimized__I__I__O__F2__O($thiz, start, end, z, op)
  } else {
    return $f_sc_TraversableOnce__reduceLeft__F2__O($thiz, op)
  }
}
function $f_sc_LinearSeqOptimized__lengthCompare__I__I($thiz, len) {
  if ((len < 0)) {
    return 1
  } else {
    var i = 0;
    var xs = $thiz;
    return $f_sc_LinearSeqOptimized__loop$1__psc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($thiz, i, xs, len)
  }
}
function $f_sc_LinearSeqOptimized__sameElements__sc_GenIterable__Z($thiz, that) {
  if ($is_sc_LinearSeq(that)) {
    var x2 = $as_sc_LinearSeq(that);
    if (($thiz === x2)) {
      return true
    } else {
      var these = $thiz;
      var those = x2;
      while ((((!these.isEmpty__Z()) && (!those.isEmpty__Z())) && $m_sr_BoxesRunTime$().equals__O__O__Z(these.head__O(), those.head__O()))) {
        these = $as_sc_LinearSeqOptimized(these.tail__O());
        those = $as_sc_LinearSeq(those.tail__O())
      };
      return (these.isEmpty__Z() && those.isEmpty__Z())
    }
  } else {
    return $f_sc_IterableLike__sameElements__sc_GenIterable__Z($thiz, that)
  }
}
function $f_sc_LinearSeqOptimized__dropRight__I__sc_LinearSeqOptimized($thiz, n) {
  var b = $thiz.companion__scg_GenericCompanion().newBuilder__scm_Builder();
  var these = $thiz;
  var lead = $thiz.drop__I__sc_LinearSeqOptimized(n);
  while ((!lead.isEmpty__Z())) {
    b.$$plus$eq__O__scm_Builder(these.head__O());
    these = $as_sc_LinearSeqOptimized(these.tail__O());
    lead = $as_sc_LinearSeqOptimized(lead.tail__O())
  };
  return $as_sc_LinearSeqOptimized(b.result__O())
}
function $f_sc_LinearSeqOptimized__apply__I__O($thiz, n) {
  var rest = $thiz.drop__I__sc_LinearSeqOptimized(n);
  if (((n < 0) || rest.isEmpty__Z())) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  return rest.head__O()
}
function $f_sc_LinearSeqOptimized__foldLeft__O__F2__O($thiz, z, op) {
  var acc = z;
  var these = $thiz;
  while ((!these.isEmpty__Z())) {
    acc = op.apply__O__O__O(acc, these.head__O());
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return acc
}
function $f_sc_LinearSeqOptimized__length__I($thiz) {
  var these = $thiz;
  var len = 0;
  while ((!these.isEmpty__Z())) {
    len = ((1 + len) | 0);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return len
}
function $f_sc_LinearSeqOptimized__contains__O__Z($thiz, elem) {
  var these = $thiz;
  while ((!these.isEmpty__Z())) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(these.head__O(), elem)) {
      return true
    };
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return false
}
function $f_sc_LinearSeqOptimized__loop$1__psc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($thiz, i, xs, len$1) {
  _loop: while (true) {
    if ((i === len$1)) {
      return (xs.isEmpty__Z() ? 0 : 1)
    } else if (xs.isEmpty__Z()) {
      return (-1)
    } else {
      var temp$i = ((1 + i) | 0);
      var temp$xs = $as_sc_LinearSeqOptimized(xs.tail__O());
      i = temp$i;
      xs = temp$xs;
      continue _loop
    }
  }
}
function $f_sc_LinearSeqOptimized__reduceLeft__F2__O($thiz, op) {
  if ($thiz.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.reduceLeft")
  } else {
    return $as_sc_LinearSeqOptimized($thiz.tail__O()).foldLeft__O__F2__O($thiz.head__O(), op)
  }
}
function $is_sc_LinearSeqOptimized(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqOptimized)))
}
function $as_sc_LinearSeqOptimized(obj) {
  return (($is_sc_LinearSeqOptimized(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqOptimized"))
}
function $isArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqOptimized)))
}
function $asArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (($isArrayOf_sc_LinearSeqOptimized(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqOptimized;", depth))
}
function $f_sc_MapLike__isEmpty__Z($thiz) {
  return ($f_sc_TraversableOnce__size__I($thiz) === 0)
}
function $f_sc_MapLike__toBuffer__scm_Buffer($thiz) {
  var result = new $c_scm_ArrayBuffer().init___I($f_sc_TraversableOnce__size__I($thiz));
  var this$1 = new $c_sjs_js_WrappedDictionary$DictionaryIterator().init___sjs_js_Dictionary($thiz.dict$5);
  while (this$1.hasNext__Z()) {
    var arg1 = this$1.next__T2();
    result.$$plus$eq__O__scm_ArrayBuffer(arg1)
  };
  return result
}
function $f_sc_MapLike__addString__scm_StringBuilder__T__T__T__scm_StringBuilder($thiz, b, start, sep, end) {
  var this$2 = new $c_sjs_js_WrappedDictionary$DictionaryIterator().init___sjs_js_Dictionary($thiz.dict$5);
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x0$1$2) {
      var x0$1 = $as_T2(x0$1$2);
      if ((x0$1 !== null)) {
        var k = x0$1.$$und1$f;
        var v = x0$1.$$und2$f;
        return (("" + $m_s_Predef$any2stringadd$().$$plus$extension__O__T__T(k, " -> ")) + v)
      } else {
        throw new $c_s_MatchError().init___O(x0$1)
      }
    })
  })($thiz));
  var this$3 = new $c_sc_Iterator$$anon$10().init___sc_Iterator__F1(this$2, f);
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this$3, b, start, sep, end)
}
function $f_sci_StringLike__scala$collection$immutable$StringLike$$isLineBreak__C__Z($thiz, c) {
  return ((c === 10) || (c === 12))
}
function $f_sci_StringLike__escape__psci_StringLike__C__T($thiz, ch) {
  return (((((ch >= 97) && (ch <= 122)) || ((ch >= 65) && (ch <= 90))) || ((ch >= 48) && (ch <= 57))) ? $as_T($g.String.fromCharCode(ch)) : ("\\" + new $c_jl_Character().init___C(ch)))
}
function $f_sci_StringLike__unwrapArg__psci_StringLike__O__O($thiz, arg) {
  if ($is_s_math_ScalaNumber(arg)) {
    var x2 = $as_s_math_ScalaNumber(arg);
    return x2.underlying__O()
  } else {
    return arg
  }
}
function $f_sci_StringLike__format__sc_Seq__T($thiz, args) {
  var jsx$3 = $m_sjsr_RuntimeString$();
  var jsx$2 = $thiz.toString__T();
  var jsx$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(arg$2) {
      return $f_sci_StringLike__unwrapArg__psci_StringLike__O__O($this, arg$2)
    })
  })($thiz));
  var this$1 = $m_sc_Seq$();
  return jsx$3.format__T__AO__T(jsx$2, $asArrayOf_O($as_sc_TraversableOnce(args.map__F1__scg_CanBuildFrom__O(jsx$1, this$1.ReusableCBFInstance$2)).toArray__s_reflect_ClassTag__O($m_s_reflect_ManifestFactory$ObjectManifest$()), 1))
}
function $f_sci_StringLike__split__C__AT($thiz, separator) {
  var thiz = $thiz.toString__T();
  var regex = $f_sci_StringLike__escape__psci_StringLike__C__T($thiz, separator);
  return $m_sjsr_RuntimeString$().split__T__T__I__AT(thiz, regex, 0)
}
function $f_sci_StringLike__stripMargin__C__T($thiz, marginChar) {
  var buf = new $c_scm_StringBuilder().init___();
  var this$1 = new $c_sci_StringLike$$anon$1().init___sci_StringLike($thiz);
  while (this$1.hasNext__Z()) {
    var arg1 = this$1.next__T();
    var len = $uI(arg1.length);
    var index = 0;
    while (true) {
      if ((index < len)) {
        var index$1 = index;
        var jsx$1 = ((65535 & $uI(arg1.charCodeAt(index$1))) <= 32)
      } else {
        var jsx$1 = false
      };
      if (jsx$1) {
        index = ((1 + index) | 0)
      } else {
        break
      }
    };
    if ((index < len)) {
      var index$2 = index;
      var jsx$3 = ((65535 & $uI(arg1.charCodeAt(index$2))) === marginChar)
    } else {
      var jsx$3 = false
    };
    if (jsx$3) {
      var beginIndex = ((1 + index) | 0);
      var jsx$2 = $as_T(arg1.substring(beginIndex))
    } else {
      var jsx$2 = arg1
    };
    buf.append__T__scm_StringBuilder(jsx$2)
  };
  return buf.underlying$5.java$lang$StringBuilder$$content$f
}
/** @constructor */
function $c_sc_AbstractIterable() {
  $c_sc_AbstractTraversable.call(this)
}
$c_sc_AbstractIterable.prototype = new $h_sc_AbstractTraversable();
$c_sc_AbstractIterable.prototype.constructor = $c_sc_AbstractIterable;
/** @constructor */
function $h_sc_AbstractIterable() {
  /*<skip>*/
}
$h_sc_AbstractIterable.prototype = $c_sc_AbstractIterable.prototype;
$c_sc_AbstractIterable.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IterableLike__sameElements__sc_GenIterable__Z(this, that)
});
$c_sc_AbstractIterable.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.iterator__sc_Iterator();
  $f_sc_Iterator__foreach__F1__V(this$1, f)
});
$c_sc_AbstractIterable.prototype.toStream__sci_Stream = (function() {
  return this.iterator__sc_Iterator().toStream__sci_Stream()
});
$c_sc_AbstractIterable.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IterableLike__copyToArray__O__I__I__V(this, xs, start, len)
});
/** @constructor */
function $c_sci_StringOps() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_sci_StringOps.prototype = new $h_O();
$c_sci_StringOps.prototype.constructor = $c_sci_StringOps;
/** @constructor */
function $h_sci_StringOps() {
  /*<skip>*/
}
$h_sci_StringOps.prototype = $c_sci_StringOps.prototype;
$c_sci_StringOps.prototype.copyToArray__O__I__V = (function(xs, start) {
  $f_sc_TraversableOnce__copyToArray__O__I__V(this, xs, start)
});
$c_sci_StringOps.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.apply__I__O = (function(idx) {
  var $$this = this.repr$1;
  var c = (65535 & $uI($$this.charCodeAt(idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_StringOps.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sci_StringOps.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sci_StringOps.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_sci_StringOps.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.equals__O__Z = (function(x$1) {
  return $m_sci_StringOps$().equals$extension__T__O__Z(this.repr$1, x$1)
});
$c_sci_StringOps.prototype.apply__I__C = (function(index) {
  var $$this = this.repr$1;
  return (65535 & $uI($$this.charCodeAt(index)))
});
$c_sci_StringOps.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sci_StringOps.prototype.toString__T = (function() {
  var $$this = this.repr$1;
  return $$this
});
$c_sci_StringOps.prototype.foreach__F1__V = (function(f) {
  $f_sc_IndexedSeqOptimized__foreach__F1__V(this, f)
});
$c_sci_StringOps.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this.length)
});
$c_sci_StringOps.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_sci_StringOps.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this.length))
});
$c_sci_StringOps.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this.length)
});
$c_sci_StringOps.prototype.sizeHintIfCheap__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this.length)
});
$c_sci_StringOps.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$3 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this.length));
  return $f_sc_Iterator__toStream__sci_Stream(this$3)
});
$c_sci_StringOps.prototype.thisCollection__sc_Seq = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sci_StringOps.prototype.max__s_math_Ordering__O = (function(cmp) {
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this, cmp)
});
$c_sci_StringOps.prototype.repr__O = (function() {
  return this.repr$1
});
$c_sci_StringOps.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sci_StringOps.prototype.isTraversableAgain__Z = (function() {
  return true
});
$c_sci_StringOps.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $m_sjsr_RuntimeString$().hashCode__T__I($$this)
});
$c_sci_StringOps.prototype.init___T = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_sci_StringOps.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  var jsx$1 = $m_sjsr_RuntimeString$();
  var $$this = this.repr$1;
  return jsx$1.toCharArray__T__AC($$this)
});
$c_sci_StringOps.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_IndexedSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_sci_StringOps.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_sci_StringOps.prototype.stringPrefix__T = (function() {
  return $f_sc_TraversableLike__stringPrefix__T(this)
});
function $is_sci_StringOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_StringOps)))
}
function $as_sci_StringOps(obj) {
  return (($is_sci_StringOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.StringOps"))
}
function $isArrayOf_sci_StringOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_StringOps)))
}
function $asArrayOf_sci_StringOps(obj, depth) {
  return (($isArrayOf_sci_StringOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.StringOps;", depth))
}
var $d_sci_StringOps = new $TypeData().initClass({
  sci_StringOps: 0
}, false, "scala.collection.immutable.StringOps", {
  sci_StringOps: 1,
  O: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_StringOps.prototype.$classData = $d_sci_StringOps;
function $is_sc_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Seq)))
}
function $as_sc_Seq(obj) {
  return (($is_sc_Seq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Seq"))
}
function $isArrayOf_sc_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Seq)))
}
function $asArrayOf_sc_Seq(obj, depth) {
  return (($isArrayOf_sc_Seq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Seq;", depth))
}
var $d_sc_Seq = new $TypeData().initClass({
  sc_Seq: 0
}, true, "scala.collection.Seq", {
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_Iterable: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1
});
/** @constructor */
function $c_sjs_js_ArrayOps() {
  $c_O.call(this);
  this.scala$scalajs$js$ArrayOps$$array$f = null
}
$c_sjs_js_ArrayOps.prototype = new $h_O();
$c_sjs_js_ArrayOps.prototype.constructor = $c_sjs_js_ArrayOps;
/** @constructor */
function $h_sjs_js_ArrayOps() {
  /*<skip>*/
}
$h_sjs_js_ArrayOps.prototype = $c_sjs_js_ArrayOps.prototype;
$c_sjs_js_ArrayOps.prototype.copyToArray__O__I__V = (function(xs, start) {
  $f_sc_TraversableOnce__copyToArray__O__I__V(this, xs, start)
});
$c_sjs_js_ArrayOps.prototype.seq__sc_TraversableOnce = (function() {
  return this.seq__sc_IndexedSeq()
});
$c_sjs_js_ArrayOps.prototype.seq__sc_IndexedSeq = (function() {
  return new $c_sjs_js_WrappedArray().init___sjs_js_Array(this.scala$scalajs$js$ArrayOps$$array$f)
});
$c_sjs_js_ArrayOps.prototype.init___ = (function() {
  $c_sjs_js_ArrayOps.prototype.init___sjs_js_Array.call(this, []);
  return this
});
$c_sjs_js_ArrayOps.prototype.apply__I__O = (function(index) {
  return this.scala$scalajs$js$ArrayOps$$array$f[index]
});
$c_sjs_js_ArrayOps.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sjs_js_ArrayOps.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sjs_js_ArrayOps.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_sjs_js_ArrayOps.prototype.thisCollection__sc_Traversable = (function() {
  return this.thisCollection__scm_IndexedSeq()
});
$c_sjs_js_ArrayOps.prototype.equals__O__Z = (function(that) {
  return $f_sc_GenSeqLike__equals__O__Z(this, that)
});
$c_sjs_js_ArrayOps.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sjs_js_ArrayOps.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  this.scala$scalajs$js$ArrayOps$$array$f.push(elem);
  return this
});
$c_sjs_js_ArrayOps.prototype.thisCollection__scm_IndexedSeq = (function() {
  var repr = this.scala$scalajs$js$ArrayOps$$array$f;
  return new $c_sjs_js_WrappedArray().init___sjs_js_Array(repr)
});
$c_sjs_js_ArrayOps.prototype.toString__T = (function() {
  return $f_sc_TraversableLike__toString__T(this)
});
$c_sjs_js_ArrayOps.prototype.foreach__F1__V = (function(f) {
  $f_sc_IndexedSeqOptimized__foreach__F1__V(this, f)
});
$c_sjs_js_ArrayOps.prototype.size__I = (function() {
  return $uI(this.scala$scalajs$js$ArrayOps$$array$f.length)
});
$c_sjs_js_ArrayOps.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_sjs_js_ArrayOps.prototype.result__O = (function() {
  return this.scala$scalajs$js$ArrayOps$$array$f
});
$c_sjs_js_ArrayOps.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.scala$scalajs$js$ArrayOps$$array$f.length))
});
$c_sjs_js_ArrayOps.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sjs_js_ArrayOps.prototype.length__I = (function() {
  return $uI(this.scala$scalajs$js$ArrayOps$$array$f.length)
});
$c_sjs_js_ArrayOps.prototype.sizeHintIfCheap__I = (function() {
  return $uI(this.scala$scalajs$js$ArrayOps$$array$f.length)
});
$c_sjs_js_ArrayOps.prototype.toStream__sci_Stream = (function() {
  var this$1 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.scala$scalajs$js$ArrayOps$$array$f.length));
  return $f_sc_Iterator__toStream__sci_Stream(this$1)
});
$c_sjs_js_ArrayOps.prototype.thisCollection__sc_Seq = (function() {
  return this.thisCollection__scm_IndexedSeq()
});
$c_sjs_js_ArrayOps.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sjs_js_ArrayOps.prototype.max__s_math_Ordering__O = (function(cmp) {
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this, cmp)
});
$c_sjs_js_ArrayOps.prototype.repr__O = (function() {
  return this.scala$scalajs$js$ArrayOps$$array$f
});
$c_sjs_js_ArrayOps.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  this.scala$scalajs$js$ArrayOps$$array$f.push(elem);
  return this
});
$c_sjs_js_ArrayOps.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sjs_js_ArrayOps.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_ArrayOps.prototype.isTraversableAgain__Z = (function() {
  return true
});
$c_sjs_js_ArrayOps.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this.seq__sc_IndexedSeq())
});
$c_sjs_js_ArrayOps.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O(this, evidence$1)
});
$c_sjs_js_ArrayOps.prototype.init___sjs_js_Array = (function(array) {
  this.scala$scalajs$js$ArrayOps$$array$f = array;
  return this
});
$c_sjs_js_ArrayOps.prototype.reduceLeft__F2__O = (function(op) {
  return $m_sjs_js_ArrayOpsCommon$().reduceLeft__sjs_js_Array__F2__O(this.scala$scalajs$js$ArrayOps$$array$f, op)
});
$c_sjs_js_ArrayOps.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_ArrayOps().init___()
});
$c_sjs_js_ArrayOps.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs)
});
$c_sjs_js_ArrayOps.prototype.stringPrefix__T = (function() {
  return $f_sc_TraversableLike__stringPrefix__T(this)
});
function $is_sjs_js_ArrayOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_ArrayOps)))
}
function $as_sjs_js_ArrayOps(obj) {
  return (($is_sjs_js_ArrayOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.ArrayOps"))
}
function $isArrayOf_sjs_js_ArrayOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_ArrayOps)))
}
function $asArrayOf_sjs_js_ArrayOps(obj, depth) {
  return (($isArrayOf_sjs_js_ArrayOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.ArrayOps;", depth))
}
var $d_sjs_js_ArrayOps = new $TypeData().initClass({
  sjs_js_ArrayOps: 0
}, false, "scala.scalajs.js.ArrayOps", {
  sjs_js_ArrayOps: 1,
  O: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sjs_js_ArrayOps.prototype.$classData = $d_sjs_js_ArrayOps;
function $is_sc_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeq)))
}
function $as_sc_IndexedSeq(obj) {
  return (($is_sc_IndexedSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeq"))
}
function $isArrayOf_sc_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeq)))
}
function $asArrayOf_sc_IndexedSeq(obj, depth) {
  return (($isArrayOf_sc_IndexedSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeq;", depth))
}
function $is_sc_LinearSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeq)))
}
function $as_sc_LinearSeq(obj) {
  return (($is_sc_LinearSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeq"))
}
function $isArrayOf_sc_LinearSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeq)))
}
function $asArrayOf_sc_LinearSeq(obj, depth) {
  return (($isArrayOf_sc_LinearSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeq;", depth))
}
/** @constructor */
function $c_sc_AbstractSeq() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSeq.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSeq.prototype.constructor = $c_sc_AbstractSeq;
/** @constructor */
function $h_sc_AbstractSeq() {
  /*<skip>*/
}
$h_sc_AbstractSeq.prototype = $c_sc_AbstractSeq.prototype;
$c_sc_AbstractSeq.prototype.equals__O__Z = (function(that) {
  return $f_sc_GenSeqLike__equals__O__Z(this, that)
});
$c_sc_AbstractSeq.prototype.isEmpty__Z = (function() {
  return $f_sc_SeqLike__isEmpty__Z(this)
});
$c_sc_AbstractSeq.prototype.toString__T = (function() {
  return $f_sc_TraversableLike__toString__T(this)
});
$c_sc_AbstractSeq.prototype.size__I = (function() {
  return this.length__I()
});
$c_sc_AbstractSeq.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sc_AbstractSeq.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this.seq__sc_Seq())
});
/** @constructor */
function $c_sc_AbstractMap() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractMap.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractMap.prototype.constructor = $c_sc_AbstractMap;
/** @constructor */
function $h_sc_AbstractMap() {
  /*<skip>*/
}
$h_sc_AbstractMap.prototype = $c_sc_AbstractMap.prototype;
$c_sc_AbstractMap.prototype.equals__O__Z = (function(that) {
  return $f_sc_GenMapLike__equals__O__Z(this, that)
});
$c_sc_AbstractMap.prototype.isEmpty__Z = (function() {
  return $f_sc_MapLike__isEmpty__Z(this)
});
$c_sc_AbstractMap.prototype.toString__T = (function() {
  return $f_sc_TraversableLike__toString__T(this)
});
$c_sc_AbstractMap.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_MapLike__toBuffer__scm_Buffer(this)
});
$c_sc_AbstractMap.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $f_sc_MapLike__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractMap.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.mapSeed$2)
});
$c_sc_AbstractMap.prototype.stringPrefix__T = (function() {
  return "Map"
});
/** @constructor */
function $c_scm_AbstractSeq() {
  $c_sc_AbstractSeq.call(this)
}
$c_scm_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$c_scm_AbstractSeq.prototype.constructor = $c_scm_AbstractSeq;
/** @constructor */
function $h_scm_AbstractSeq() {
  /*<skip>*/
}
$h_scm_AbstractSeq.prototype = $c_scm_AbstractSeq.prototype;
$c_scm_AbstractSeq.prototype.seq__sc_TraversableOnce = (function() {
  return this.seq__scm_Seq()
});
$c_scm_AbstractSeq.prototype.seq__scm_Seq = (function() {
  return this
});
/** @constructor */
function $c_sci_Stream() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_Stream.prototype = new $h_sc_AbstractSeq();
$c_sci_Stream.prototype.constructor = $c_sci_Stream;
/** @constructor */
function $h_sci_Stream() {
  /*<skip>*/
}
$h_sci_Stream.prototype = $c_sci_Stream.prototype;
$c_sci_Stream.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Stream.prototype.apply__I__O = (function(n) {
  return $f_sc_LinearSeqOptimized__apply__I__O(this, n)
});
$c_sci_Stream.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_LinearSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sci_Stream.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $f_sc_LinearSeqOptimized__apply__I__O(this, n)
});
$c_sci_Stream.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_LinearSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sci_Stream.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Stream.prototype.equals__O__Z = (function(that) {
  return ((this === that) || $f_sc_GenSeqLike__equals__O__Z(this, that))
});
$c_sci_Stream.prototype.flatMap__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var nonEmptyPrefix = new $c_sr_ObjectRef().init___O(this);
      var prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream();
      while (((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z()) && prefix.isEmpty__Z())) {
        nonEmptyPrefix.elem$1 = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix.elem$1).tail__O());
        if ((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z())) {
          prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream()
        }
      };
      var x$1 = ($as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z() ? ($m_sci_Stream$(), $m_sci_Stream$Empty$()) : prefix.append__F0__sci_Stream(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1, nonEmptyPrefix$1) {
        return (function() {
          var x = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix$1.elem$1).tail__O()).flatMap__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f, nonEmptyPrefix))))
    };
    return x$1
  } else {
    return $f_sc_TraversableLike__flatMap__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.filterImpl__F1__Z__sci_Stream = (function(p, isFlipped) {
  var rest = this;
  while (((!rest.isEmpty__Z()) && ($uZ(p.apply__O__O(rest.head__O())) === isFlipped))) {
    rest = $as_sci_Stream(rest.tail__O())
  };
  var this$1 = rest;
  if ($f_sc_TraversableOnce__nonEmpty__Z(this$1)) {
    return $m_sci_Stream$().filteredTail__sci_Stream__F1__Z__sci_Stream$Cons(rest, p, isFlipped)
  } else {
    return $m_sci_Stream$Empty$()
  }
});
$c_sci_Stream.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  this.force__sci_Stream();
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, start, sep, end)
});
$c_sci_Stream.prototype.withFilter__F1__scg_FilterMonadic = (function(p) {
  return new $c_sci_Stream$StreamWithFilter().init___F0__F1(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $this
    })
  })(this)), p)
});
$c_sci_Stream.prototype.toString__T = (function() {
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this, "Stream(", ", ", ")")
});
$c_sci_Stream.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Stream$()
});
$c_sci_Stream.prototype.foreach__F1__V = (function(f) {
  var _$this = this;
  _foreach: while (true) {
    if ((!_$this.isEmpty__Z())) {
      f.apply__O__O(_$this.head__O());
      _$this = $as_sci_Stream(_$this.tail__O());
      continue _foreach
    };
    break
  }
});
$c_sci_Stream.prototype.foldLeft__O__F2__O = (function(z, op) {
  var _$this = this;
  _foldLeft: while (true) {
    if (_$this.isEmpty__Z()) {
      return z
    } else {
      var temp$_$this = $as_sci_Stream(_$this.tail__O());
      var temp$z = op.apply__O__O__O(z, _$this.head__O());
      _$this = temp$_$this;
      z = temp$z;
      continue _foldLeft
    }
  }
});
$c_sci_Stream.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_StreamIterator().init___sci_Stream(this)
});
$c_sci_Stream.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.length__I = (function() {
  var len = 0;
  var left = this;
  while ((!left.isEmpty__Z())) {
    len = ((1 + len) | 0);
    left = $as_sci_Stream(left.tail__O())
  };
  return len
});
$c_sci_Stream.prototype.toStream__sci_Stream = (function() {
  return this
});
$c_sci_Stream.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.drop__I__sci_Stream = (function(n) {
  var _$this = this;
  _drop: while (true) {
    if (((n <= 0) || _$this.isEmpty__Z())) {
      return _$this
    } else {
      var temp$_$this = $as_sci_Stream(_$this.tail__O());
      var temp$n = (((-1) + n) | 0);
      _$this = temp$_$this;
      n = temp$n;
      continue _drop
    }
  }
});
$c_sci_Stream.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  b.append__T__scm_StringBuilder(start);
  if ((!this.isEmpty__Z())) {
    b.append__O__scm_StringBuilder(this.head__O());
    var cursor = this;
    var n = 1;
    if (cursor.tailDefined__Z()) {
      var scout = $as_sci_Stream(this.tail__O());
      if (scout.isEmpty__Z()) {
        b.append__T__scm_StringBuilder(end);
        return b
      };
      if ((cursor !== scout)) {
        cursor = scout;
        if (scout.tailDefined__Z()) {
          scout = $as_sci_Stream(scout.tail__O());
          while (((cursor !== scout) && scout.tailDefined__Z())) {
            b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
            n = ((1 + n) | 0);
            cursor = $as_sci_Stream(cursor.tail__O());
            scout = $as_sci_Stream(scout.tail__O());
            if (scout.tailDefined__Z()) {
              scout = $as_sci_Stream(scout.tail__O())
            }
          }
        }
      };
      if ((!scout.tailDefined__Z())) {
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        var this$1 = cursor;
        if ($f_sc_TraversableOnce__nonEmpty__Z(this$1)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O())
        }
      } else {
        var runner = this;
        var k = 0;
        while ((runner !== scout)) {
          runner = $as_sci_Stream(runner.tail__O());
          scout = $as_sci_Stream(scout.tail__O());
          k = ((1 + k) | 0)
        };
        if (((cursor === scout) && (k > 0))) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        n = ((n - k) | 0)
      }
    };
    if ((!cursor.isEmpty__Z())) {
      if ((!cursor.tailDefined__Z())) {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("?")
      } else {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("...")
      }
    }
  };
  b.append__T__scm_StringBuilder(end);
  return b
});
$c_sci_Stream.prototype.force__sci_Stream = (function() {
  var these = this;
  var those = this;
  if ((!these.isEmpty__Z())) {
    these = $as_sci_Stream(these.tail__O())
  };
  while ((those !== these)) {
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if ((these === those)) {
      return this
    };
    those = $as_sci_Stream(those.tail__O())
  };
  return this
});
$c_sci_Stream.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Stream.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var hd = f.apply__O__O(this.head__O());
      var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1) {
        return (function() {
          var x = $as_sci_Stream($this.tail__O()).map__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f));
      var x$1 = new $c_sci_Stream$Cons().init___O__F0(hd, tl)
    };
    return x$1
  } else {
    return $f_sc_TraversableLike__map__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.reduceLeft__F2__O = (function(f) {
  if (this.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.reduceLeft")
  } else {
    var reducedRes = this.head__O();
    var left = $as_sci_Stream(this.tail__O());
    while ((!left.isEmpty__Z())) {
      reducedRes = f.apply__O__O__O(reducedRes, left.head__O());
      left = $as_sci_Stream(left.tail__O())
    };
    return reducedRes
  }
});
$c_sci_Stream.prototype.append__F0__sci_Stream = (function(rest) {
  if (this.isEmpty__Z()) {
    return $as_sc_GenTraversableOnce(rest.apply__O()).toStream__sci_Stream()
  } else {
    var hd = this.head__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, rest$1) {
      return (function() {
        return $as_sci_Stream($this.tail__O()).append__F0__sci_Stream(rest$1)
      })
    })(this, rest));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  }
});
$c_sci_Stream.prototype.stringPrefix__T = (function() {
  return "Stream"
});
function $is_sci_Stream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream)))
}
function $as_sci_Stream(obj) {
  return (($is_sci_Stream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream"))
}
function $isArrayOf_sci_Stream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream)))
}
function $asArrayOf_sci_Stream(obj, depth) {
  return (($isArrayOf_sci_Stream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream;", depth))
}
function $is_scm_Buffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Buffer)))
}
function $as_scm_Buffer(obj) {
  return (($is_scm_Buffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Buffer"))
}
function $isArrayOf_scm_Buffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Buffer)))
}
function $asArrayOf_scm_Buffer(obj, depth) {
  return (($isArrayOf_scm_Buffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Buffer;", depth))
}
function $f_scm_ResizableArray__apply__I__O($thiz, idx) {
  if ((idx >= $thiz.size0$6)) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  };
  return $thiz.array$6.get(idx)
}
function $f_scm_ResizableArray__foreach__F1__V($thiz, f) {
  var i = 0;
  var top = $thiz.size0$6;
  while ((i < top)) {
    f.apply__O__O($thiz.array$6.get(i));
    i = ((1 + i) | 0)
  }
}
function $f_scm_ResizableArray__ensureSize__I__V($thiz, n) {
  var value = $thiz.array$6.u.length;
  var hi = (value >> 31);
  var hi$1 = (n >> 31);
  if (((hi$1 === hi) ? (((-2147483648) ^ n) > ((-2147483648) ^ value)) : (hi$1 > hi))) {
    var lo = (value << 1);
    var hi$2 = (((value >>> 31) | 0) | (hi << 1));
    var newSize_$_lo$2 = lo;
    var newSize_$_hi$2 = hi$2;
    while (true) {
      var hi$3 = (n >> 31);
      var b_$_lo$2 = newSize_$_lo$2;
      var b_$_hi$2 = newSize_$_hi$2;
      var bhi = b_$_hi$2;
      if (((hi$3 === bhi) ? (((-2147483648) ^ n) > ((-2147483648) ^ b_$_lo$2)) : (hi$3 > bhi))) {
        var this$1_$_lo$2 = newSize_$_lo$2;
        var this$1_$_hi$2 = newSize_$_hi$2;
        var lo$1 = (this$1_$_lo$2 << 1);
        var hi$4 = (((this$1_$_lo$2 >>> 31) | 0) | (this$1_$_hi$2 << 1));
        var jsx$1_$_lo$2 = lo$1;
        var jsx$1_$_hi$2 = hi$4;
        newSize_$_lo$2 = jsx$1_$_lo$2;
        newSize_$_hi$2 = jsx$1_$_hi$2
      } else {
        break
      }
    };
    var this$2_$_lo$2 = newSize_$_lo$2;
    var this$2_$_hi$2 = newSize_$_hi$2;
    var ahi = this$2_$_hi$2;
    if (((ahi === 0) ? (((-2147483648) ^ this$2_$_lo$2) > (-1)) : (ahi > 0))) {
      var jsx$2_$_lo$2 = 2147483647;
      var jsx$2_$_hi$2 = 0;
      newSize_$_lo$2 = jsx$2_$_lo$2;
      newSize_$_hi$2 = jsx$2_$_hi$2
    };
    var this$3_$_lo$2 = newSize_$_lo$2;
    var this$3_$_hi$2 = newSize_$_hi$2;
    var newArray = $newArrayObject($d_O.getArrayOf(), [this$3_$_lo$2]);
    $systemArraycopy($thiz.array$6, 0, newArray, 0, $thiz.size0$6);
    $thiz.array$6 = newArray
  }
}
function $f_scm_ResizableArray__$$init$__V($thiz) {
  var x = $thiz.initialSize$6;
  $thiz.array$6 = $newArrayObject($d_O.getArrayOf(), [((x > 1) ? x : 1)]);
  $thiz.size0$6 = 0
}
function $f_scm_ResizableArray__copyToArray__O__I__I__V($thiz, xs, start, len) {
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var x = ((len < that) ? len : that);
  var that$1 = $thiz.size0$6;
  var len1 = ((x < that$1) ? x : that$1);
  if ((len1 > 0)) {
    $m_s_Array$().copy__O__I__O__I__I__V($thiz.array$6, 0, xs, start, len1)
  }
}
/** @constructor */
function $c_sci_List() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_List.prototype = new $h_sc_AbstractSeq();
$c_sci_List.prototype.constructor = $c_sci_List;
/** @constructor */
function $h_sci_List() {
  /*<skip>*/
}
$h_sci_List.prototype = $c_sci_List.prototype;
$c_sci_List.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_List.prototype.apply__I__O = (function(n) {
  return $f_sc_LinearSeqOptimized__apply__I__O(this, n)
});
$c_sci_List.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_LinearSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sci_List.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $f_sc_LinearSeqOptimized__apply__I__O(this, n)
});
$c_sci_List.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_LinearSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sci_List.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_List.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.take__I__sci_List = (function(n) {
  if ((this.isEmpty__Z() || (n <= 0))) {
    return $m_sci_Nil$()
  } else {
    var h = new $c_sci_$colon$colon().init___O__sci_List(this.head__O(), $m_sci_Nil$());
    var t = h;
    var rest = this.tail__sci_List();
    var i = 1;
    while (true) {
      if (rest.isEmpty__Z()) {
        return this
      };
      if ((i < n)) {
        i = ((1 + i) | 0);
        var nx = new $c_sci_$colon$colon().init___O__sci_List(rest.head__O(), $m_sci_Nil$());
        t.tl$5 = nx;
        t = nx;
        var this$1 = rest;
        rest = this$1.tail__sci_List()
      } else {
        break
      }
    };
    return h
  }
});
$c_sci_List.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_List$()
});
$c_sci_List.prototype.foreach__F1__V = (function(f) {
  var these = this;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    var this$1 = these;
    these = this$1.tail__sci_List()
  }
});
$c_sci_List.prototype.foldLeft__O__F2__O = (function(z, op) {
  return $f_sc_LinearSeqOptimized__foldLeft__O__F2__O(this, z, op)
});
$c_sci_List.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(this)
});
$c_sci_List.prototype.drop__I__sci_List = (function(n) {
  var these = this;
  var count = n;
  while (((!these.isEmpty__Z()) && (count > 0))) {
    var this$1 = these;
    these = this$1.tail__sci_List();
    count = (((-1) + count) | 0)
  };
  return these
});
$c_sci_List.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.length__I = (function() {
  return $f_sc_LinearSeqOptimized__length__I(this)
});
$c_sci_List.prototype.toStream__sci_Stream = (function() {
  return (this.isEmpty__Z() ? $m_sci_Stream$Empty$() : new $c_sci_Stream$Cons().init___O__F0(this.head__O(), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $this.tail__sci_List().toStream__sci_Stream()
    })
  })(this))))
});
$c_sci_List.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_List.prototype.map__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ((bf === $m_sci_List$().ReusableCBFInstance$2)) {
    if ((this === $m_sci_Nil$())) {
      return $m_sci_Nil$()
    } else {
      var h = new $c_sci_$colon$colon().init___O__sci_List(f.apply__O__O(this.head__O()), $m_sci_Nil$());
      var t = h;
      var rest = this.tail__sci_List();
      while ((rest !== $m_sci_Nil$())) {
        var nx = new $c_sci_$colon$colon().init___O__sci_List(f.apply__O__O(rest.head__O()), $m_sci_Nil$());
        t.tl$5 = nx;
        t = nx;
        var this$1 = rest;
        rest = this$1.tail__sci_List()
      };
      return h
    }
  } else {
    return $f_sc_TraversableLike__map__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_List.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_LinearSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_sci_List.prototype.stringPrefix__T = (function() {
  return "List"
});
function $is_sci_List(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_List)))
}
function $as_sci_List(obj) {
  return (($is_sci_List(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.List"))
}
function $isArrayOf_sci_List(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_List)))
}
function $asArrayOf_sci_List(obj, depth) {
  return (($isArrayOf_sci_List(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.List;", depth))
}
/** @constructor */
function $c_sci_Stream$Cons() {
  $c_sci_Stream.call(this);
  this.hd$5 = null;
  this.tlVal$5 = null;
  this.tlGen$5 = null
}
$c_sci_Stream$Cons.prototype = new $h_sci_Stream();
$c_sci_Stream$Cons.prototype.constructor = $c_sci_Stream$Cons;
/** @constructor */
function $h_sci_Stream$Cons() {
  /*<skip>*/
}
$h_sci_Stream$Cons.prototype = $c_sci_Stream$Cons.prototype;
$c_sci_Stream$Cons.prototype.head__O = (function() {
  return this.hd$5
});
$c_sci_Stream$Cons.prototype.tail__sci_Stream = (function() {
  if ((!this.tailDefined__Z())) {
    if ((!this.tailDefined__Z())) {
      this.tlVal$5 = $as_sci_Stream(this.tlGen$5.apply__O());
      this.tlGen$5 = null
    }
  };
  return this.tlVal$5
});
$c_sci_Stream$Cons.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  if ($is_sci_Stream$Cons(that)) {
    var x2 = $as_sci_Stream$Cons(that);
    return this.consEq$1__p5__sci_Stream$Cons__sci_Stream$Cons__Z(this, x2)
  } else {
    return $f_sc_LinearSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
  }
});
$c_sci_Stream$Cons.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_Stream$Cons.prototype.tailDefined__Z = (function() {
  return (this.tlGen$5 === null)
});
$c_sci_Stream$Cons.prototype.consEq$1__p5__sci_Stream$Cons__sci_Stream$Cons__Z = (function(a, b) {
  _consEq: while (true) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(a.hd$5, b.hd$5)) {
      var x1 = a.tail__sci_Stream();
      if ($is_sci_Stream$Cons(x1)) {
        var x2 = $as_sci_Stream$Cons(x1);
        var x1$2 = b.tail__sci_Stream();
        if ($is_sci_Stream$Cons(x1$2)) {
          var x2$2 = $as_sci_Stream$Cons(x1$2);
          if ((x2 === x2$2)) {
            return true
          } else {
            a = x2;
            b = x2$2;
            continue _consEq
          }
        } else {
          return false
        }
      } else {
        return b.tail__sci_Stream().isEmpty__Z()
      }
    } else {
      return false
    }
  }
});
$c_sci_Stream$Cons.prototype.tail__O = (function() {
  return this.tail__sci_Stream()
});
$c_sci_Stream$Cons.prototype.init___O__F0 = (function(hd, tl) {
  this.hd$5 = hd;
  this.tlGen$5 = tl;
  return this
});
function $is_sci_Stream$Cons(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream$Cons)))
}
function $as_sci_Stream$Cons(obj) {
  return (($is_sci_Stream$Cons(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream$Cons"))
}
function $isArrayOf_sci_Stream$Cons(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream$Cons)))
}
function $asArrayOf_sci_Stream$Cons(obj, depth) {
  return (($isArrayOf_sci_Stream$Cons(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream$Cons;", depth))
}
var $d_sci_Stream$Cons = new $TypeData().initClass({
  sci_Stream$Cons: 0
}, false, "scala.collection.immutable.Stream$Cons", {
  sci_Stream$Cons: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Cons.prototype.$classData = $d_sci_Stream$Cons;
/** @constructor */
function $c_sci_Stream$Empty$() {
  $c_sci_Stream.call(this)
}
$c_sci_Stream$Empty$.prototype = new $h_sci_Stream();
$c_sci_Stream$Empty$.prototype.constructor = $c_sci_Stream$Empty$;
/** @constructor */
function $h_sci_Stream$Empty$() {
  /*<skip>*/
}
$h_sci_Stream$Empty$.prototype = $c_sci_Stream$Empty$.prototype;
$c_sci_Stream$Empty$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Stream$Empty$.prototype.init___ = (function() {
  return this
});
$c_sci_Stream$Empty$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Stream$Empty$.prototype.tailDefined__Z = (function() {
  return false
});
$c_sci_Stream$Empty$.prototype.tail__sr_Nothing$ = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty stream")
});
$c_sci_Stream$Empty$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty stream")
});
$c_sci_Stream$Empty$.prototype.tail__O = (function() {
  this.tail__sr_Nothing$()
});
var $d_sci_Stream$Empty$ = new $TypeData().initClass({
  sci_Stream$Empty$: 0
}, false, "scala.collection.immutable.Stream$Empty$", {
  sci_Stream$Empty$: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Empty$.prototype.$classData = $d_sci_Stream$Empty$;
var $n_sci_Stream$Empty$ = (void 0);
function $m_sci_Stream$Empty$() {
  if ((!$n_sci_Stream$Empty$)) {
    $n_sci_Stream$Empty$ = new $c_sci_Stream$Empty$().init___()
  };
  return $n_sci_Stream$Empty$
}
/** @constructor */
function $c_sci_Vector() {
  $c_sc_AbstractSeq.call(this);
  this.startIndex$4 = 0;
  this.endIndex$4 = 0;
  this.focus$4 = 0;
  this.dirty$4 = false;
  this.depth$4 = 0;
  this.display0$4 = null;
  this.display1$4 = null;
  this.display2$4 = null;
  this.display3$4 = null;
  this.display4$4 = null;
  this.display5$4 = null
}
$c_sci_Vector.prototype = new $h_sc_AbstractSeq();
$c_sci_Vector.prototype.constructor = $c_sci_Vector;
/** @constructor */
function $h_sci_Vector() {
  /*<skip>*/
}
$h_sci_Vector.prototype = $c_sci_Vector.prototype;
$c_sci_Vector.prototype.checkRangeConvert__p4__I__I = (function(index) {
  var idx = ((index + this.startIndex$4) | 0);
  if (((index >= 0) && (idx < this.endIndex$4))) {
    return idx
  } else {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + index))
  }
});
$c_sci_Vector.prototype.display3__AO = (function() {
  return this.display3$4
});
$c_sci_Vector.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Vector.prototype.apply__I__O = (function(index) {
  var idx = this.checkRangeConvert__p4__I__I(index);
  var xor = (idx ^ this.focus$4);
  return $f_sci_VectorPointer__getElem__I__I__O(this, idx, xor)
});
$c_sci_Vector.prototype.depth__I = (function() {
  return this.depth$4
});
$c_sci_Vector.prototype.lengthCompare__I__I = (function(len) {
  return ((this.length__I() - len) | 0)
});
$c_sci_Vector.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_sci_Vector.prototype.initIterator__sci_VectorIterator__V = (function(s) {
  var depth = this.depth$4;
  $f_sci_VectorPointer__initFrom__sci_VectorPointer__I__V(s, this, depth);
  if (this.dirty$4) {
    var index = this.focus$4;
    $f_sci_VectorPointer__stabilize__I__V(s, index)
  };
  if ((s.depth$2 > 1)) {
    var index$1 = this.startIndex$4;
    var xor = (this.startIndex$4 ^ this.focus$4);
    $f_sci_VectorPointer__gotoPos__I__I__V(s, index$1, xor)
  }
});
$c_sci_Vector.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Vector.prototype.init___I__I__I = (function(startIndex, endIndex, focus) {
  this.startIndex$4 = startIndex;
  this.endIndex$4 = endIndex;
  this.focus$4 = focus;
  this.dirty$4 = false;
  return this
});
$c_sci_Vector.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$4 = x$1
});
$c_sci_Vector.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Vector$()
});
$c_sci_Vector.prototype.display0__AO = (function() {
  return this.display0$4
});
$c_sci_Vector.prototype.display4__AO = (function() {
  return this.display4$4
});
$c_sci_Vector.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$4 = x$1
});
$c_sci_Vector.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_sci_Vector.prototype.iterator__sc_Iterator = (function() {
  return this.iterator__sci_VectorIterator()
});
$c_sci_Vector.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$4 = x$1
});
$c_sci_Vector.prototype.length__I = (function() {
  return ((this.endIndex$4 - this.startIndex$4) | 0)
});
$c_sci_Vector.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$4 = x$1
});
$c_sci_Vector.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.sizeHintIfCheap__I = (function() {
  return this.length__I()
});
$c_sci_Vector.prototype.display1__AO = (function() {
  return this.display1$4
});
$c_sci_Vector.prototype.display5__AO = (function() {
  return this.display5$4
});
$c_sci_Vector.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.iterator__sci_VectorIterator = (function() {
  var s = new $c_sci_VectorIterator().init___I__I(this.startIndex$4, this.endIndex$4);
  this.initIterator__sci_VectorIterator__V(s);
  return s
});
$c_sci_Vector.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Vector.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$4 = x$1
});
$c_sci_Vector.prototype.display2__AO = (function() {
  return this.display2$4
});
$c_sci_Vector.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$4 = x$1
});
$c_sci_Vector.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$4 = x$1
});
function $is_sci_Vector(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Vector)))
}
function $as_sci_Vector(obj) {
  return (($is_sci_Vector(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Vector"))
}
function $isArrayOf_sci_Vector(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Vector)))
}
function $asArrayOf_sci_Vector(obj, depth) {
  return (($isArrayOf_sci_Vector(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Vector;", depth))
}
var $d_sci_Vector = new $TypeData().initClass({
  sci_Vector: 0
}, false, "scala.collection.immutable.Vector", {
  sci_Vector: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_VectorPointer: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_Vector.prototype.$classData = $d_sci_Vector;
/** @constructor */
function $c_sci_WrappedString() {
  $c_sc_AbstractSeq.call(this);
  this.self$4 = null
}
$c_sci_WrappedString.prototype = new $h_sc_AbstractSeq();
$c_sci_WrappedString.prototype.constructor = $c_sci_WrappedString;
/** @constructor */
function $h_sci_WrappedString() {
  /*<skip>*/
}
$h_sci_WrappedString.prototype = $c_sci_WrappedString.prototype;
$c_sci_WrappedString.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_WrappedString.prototype.apply__I__O = (function(idx) {
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz.charCodeAt(idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sci_WrappedString.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sci_WrappedString.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz.charCodeAt(n)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_WrappedString.prototype.apply__I__C = (function(n) {
  var thiz = this.self$4;
  return (65535 & $uI(thiz.charCodeAt(n)))
});
$c_sci_WrappedString.prototype.toString__T = (function() {
  return this.self$4
});
$c_sci_WrappedString.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_IndexedSeq$()
});
$c_sci_WrappedString.prototype.foreach__F1__V = (function(f) {
  $f_sc_IndexedSeqOptimized__foreach__F1__V(this, f)
});
$c_sci_WrappedString.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_sci_WrappedString.prototype.iterator__sc_Iterator = (function() {
  var thiz = this.self$4;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz.length))
});
$c_sci_WrappedString.prototype.length__I = (function() {
  var thiz = this.self$4;
  return $uI(thiz.length)
});
$c_sci_WrappedString.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.sizeHintIfCheap__I = (function() {
  var thiz = this.self$4;
  return $uI(thiz.length)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sci_WrappedString.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_WrappedString.prototype.init___T = (function(self) {
  this.self$4 = self;
  return this
});
$c_sci_WrappedString.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $m_sjsr_RuntimeString$().toCharArray__T__AC(this.self$4)
});
$c_sci_WrappedString.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_IndexedSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_sci_WrappedString.prototype.newBuilder__scm_Builder = (function() {
  return $m_sci_WrappedString$().newBuilder__scm_Builder()
});
var $d_sci_WrappedString = new $TypeData().initClass({
  sci_WrappedString: 0
}, false, "scala.collection.immutable.WrappedString", {
  sci_WrappedString: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_WrappedString.prototype.$classData = $d_sci_WrappedString;
/** @constructor */
function $c_sci_$colon$colon() {
  $c_sci_List.call(this);
  this.head$5 = null;
  this.tl$5 = null
}
$c_sci_$colon$colon.prototype = new $h_sci_List();
$c_sci_$colon$colon.prototype.constructor = $c_sci_$colon$colon;
/** @constructor */
function $h_sci_$colon$colon() {
  /*<skip>*/
}
$h_sci_$colon$colon.prototype = $c_sci_$colon$colon.prototype;
$c_sci_$colon$colon.prototype.productPrefix__T = (function() {
  return "::"
});
$c_sci_$colon$colon.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_$colon$colon.prototype.productArity__I = (function() {
  return 2
});
$c_sci_$colon$colon.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_$colon$colon.prototype.tail__sci_List = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.head$5;
      break
    }
    case 1: {
      return this.tl$5;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sci_$colon$colon.prototype.tail__O = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.init___O__sci_List = (function(head, tl) {
  this.head$5 = head;
  this.tl$5 = tl;
  return this
});
$c_sci_$colon$colon.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_$colon$colon = new $TypeData().initClass({
  sci_$colon$colon: 0
}, false, "scala.collection.immutable.$colon$colon", {
  sci_$colon$colon: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_$colon$colon.prototype.$classData = $d_sci_$colon$colon;
/** @constructor */
function $c_sci_Nil$() {
  $c_sci_List.call(this)
}
$c_sci_Nil$.prototype = new $h_sci_List();
$c_sci_Nil$.prototype.constructor = $c_sci_Nil$;
/** @constructor */
function $h_sci_Nil$() {
  /*<skip>*/
}
$h_sci_Nil$.prototype = $c_sci_Nil$.prototype;
$c_sci_Nil$.prototype.init___ = (function() {
  return this
});
$c_sci_Nil$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Nil$.prototype.productPrefix__T = (function() {
  return "Nil"
});
$c_sci_Nil$.prototype.productArity__I = (function() {
  return 0
});
$c_sci_Nil$.prototype.tail__sci_List = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty list")
});
$c_sci_Nil$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Nil$.prototype.equals__O__Z = (function(that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return x2.isEmpty__Z()
  } else {
    return false
  }
});
$c_sci_Nil$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_sci_Nil$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty list")
});
$c_sci_Nil$.prototype.tail__O = (function() {
  return this.tail__sci_List()
});
$c_sci_Nil$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_Nil$ = new $TypeData().initClass({
  sci_Nil$: 0
}, false, "scala.collection.immutable.Nil$", {
  sci_Nil$: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Nil$.prototype.$classData = $d_sci_Nil$;
var $n_sci_Nil$ = (void 0);
function $m_sci_Nil$() {
  if ((!$n_sci_Nil$)) {
    $n_sci_Nil$ = new $c_sci_Nil$().init___()
  };
  return $n_sci_Nil$
}
/** @constructor */
function $c_scm_AbstractMap() {
  $c_sc_AbstractMap.call(this)
}
$c_scm_AbstractMap.prototype = new $h_sc_AbstractMap();
$c_scm_AbstractMap.prototype.constructor = $c_scm_AbstractMap;
/** @constructor */
function $h_scm_AbstractMap() {
  /*<skip>*/
}
$h_scm_AbstractMap.prototype = $c_scm_AbstractMap.prototype;
$c_scm_AbstractMap.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_AbstractMap.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_Iterable$()
});
$c_scm_AbstractMap.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_AbstractMap.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_AbstractMap.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs)
});
$c_scm_AbstractMap.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_WrappedDictionary().init___sjs_js_Dictionary({})
});
/** @constructor */
function $c_sjs_js_WrappedDictionary() {
  $c_scm_AbstractMap.call(this);
  this.dict$5 = null
}
$c_sjs_js_WrappedDictionary.prototype = new $h_scm_AbstractMap();
$c_sjs_js_WrappedDictionary.prototype.constructor = $c_sjs_js_WrappedDictionary;
/** @constructor */
function $h_sjs_js_WrappedDictionary() {
  /*<skip>*/
}
$h_sjs_js_WrappedDictionary.prototype = $c_sjs_js_WrappedDictionary.prototype;
$c_sjs_js_WrappedDictionary.prototype.apply__O__O = (function(key) {
  return this.apply__T__O($as_T(key))
});
$c_sjs_js_WrappedDictionary.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sjs_js_WrappedDictionary.prototype.init___sjs_js_Dictionary = (function(dict) {
  this.dict$5 = dict;
  return this
});
$c_sjs_js_WrappedDictionary.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__T2__sjs_js_WrappedDictionary($as_T2(elem))
});
$c_sjs_js_WrappedDictionary.prototype.result__O = (function() {
  return this
});
$c_sjs_js_WrappedDictionary.prototype.iterator__sc_Iterator = (function() {
  return new $c_sjs_js_WrappedDictionary$DictionaryIterator().init___sjs_js_Dictionary(this.dict$5)
});
$c_sjs_js_WrappedDictionary.prototype.apply__T__O = (function(key) {
  var dict = this.dict$5;
  if ($uZ($m_sjs_js_WrappedDictionary$Cache$().safeHasOwnProperty$1.call(dict, key))) {
    return this.dict$5[key]
  } else {
    throw new $c_ju_NoSuchElementException().init___T(("key not found: " + key))
  }
});
$c_sjs_js_WrappedDictionary.prototype.get__T__s_Option = (function(key) {
  var dict = this.dict$5;
  if ($uZ($m_sjs_js_WrappedDictionary$Cache$().safeHasOwnProperty$1.call(dict, key))) {
    return new $c_s_Some().init___O(this.dict$5[key])
  } else {
    return $m_s_None$()
  }
});
$c_sjs_js_WrappedDictionary.prototype.$$plus$eq__T2__sjs_js_WrappedDictionary = (function(kv) {
  this.dict$5[$as_T(kv.$$und1$f)] = kv.$$und2$f;
  return this
});
$c_sjs_js_WrappedDictionary.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__T2__sjs_js_WrappedDictionary($as_T2(elem))
});
var $d_sjs_js_WrappedDictionary = new $TypeData().initClass({
  sjs_js_WrappedDictionary: 0
}, false, "scala.scalajs.js.WrappedDictionary", {
  sjs_js_WrappedDictionary: 1,
  scm_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  scm_Map: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_MapLike: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1
});
$c_sjs_js_WrappedDictionary.prototype.$classData = $d_sjs_js_WrappedDictionary;
/** @constructor */
function $c_scm_AbstractBuffer() {
  $c_scm_AbstractSeq.call(this)
}
$c_scm_AbstractBuffer.prototype = new $h_scm_AbstractSeq();
$c_scm_AbstractBuffer.prototype.constructor = $c_scm_AbstractBuffer;
/** @constructor */
function $h_scm_AbstractBuffer() {
  /*<skip>*/
}
$h_scm_AbstractBuffer.prototype = $c_scm_AbstractBuffer.prototype;
$c_scm_AbstractBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs)
});
/** @constructor */
function $c_scm_ListBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.scala$collection$mutable$ListBuffer$$start$6 = null;
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
}
$c_scm_ListBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ListBuffer.prototype.constructor = $c_scm_ListBuffer;
/** @constructor */
function $h_scm_ListBuffer() {
  /*<skip>*/
}
$h_scm_ListBuffer.prototype = $c_scm_ListBuffer.prototype;
$c_scm_ListBuffer.prototype.copyToArray__O__I__V = (function(xs, start) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  $f_sc_TraversableOnce__copyToArray__O__I__V(this$1, xs, start)
});
$c_scm_ListBuffer.prototype.copy__p6__V = (function() {
  if (this.isEmpty__Z()) {
    return (void 0)
  };
  var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
  var this$1 = this.last0$6;
  var limit = this$1.tl$5;
  this.clear__V();
  while ((cursor !== limit)) {
    this.$$plus$eq__O__scm_ListBuffer(cursor.head__O());
    var this$2 = cursor;
    cursor = this$2.tail__sci_List()
  }
});
$c_scm_ListBuffer.prototype.init___ = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.exported$6 = false;
  this.len$6 = 0;
  return this
});
$c_scm_ListBuffer.prototype.apply__I__O = (function(n) {
  if (((n < 0) || (n >= this.len$6))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  } else {
    var this$2 = this.scala$collection$mutable$ListBuffer$$start$6;
    return $f_sc_LinearSeqOptimized__apply__I__O(this$2, n)
  }
});
$c_scm_ListBuffer.prototype.lengthCompare__I__I = (function(len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_LinearSeqOptimized__lengthCompare__I__I(this$1, len)
});
$c_scm_ListBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_LinearSeqOptimized__sameElements__sc_GenIterable__Z(this$1, that)
});
$c_scm_ListBuffer.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_scm_ListBuffer.prototype.isEmpty__Z = (function() {
  return (this.len$6 === 0)
});
$c_scm_ListBuffer.prototype.toList__sci_List = (function() {
  this.exported$6 = (!this.isEmpty__Z());
  return this.scala$collection$mutable$ListBuffer$$start$6
});
$c_scm_ListBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ListBuffer.prototype.equals__O__Z = (function(that) {
  if ($is_scm_ListBuffer(that)) {
    var x2 = $as_scm_ListBuffer(that);
    return this.scala$collection$mutable$ListBuffer$$start$6.equals__O__Z(x2.scala$collection$mutable$ListBuffer$$start$6)
  } else {
    return $f_sc_GenSeqLike__equals__O__Z(this, that)
  }
});
$c_scm_ListBuffer.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_TraversableOnce__mkString__T__T__T__T(this$1, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ListBuffer$()
});
$c_scm_ListBuffer.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    var this$2 = these;
    these = this$2.tail__sci_List()
  }
});
$c_scm_ListBuffer.prototype.toBuffer__scm_Buffer = (function() {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  var this$2 = $m_scm_ArrayBuffer$();
  var cbf = this$2.ReusableCBFInstance$2;
  return $as_scm_Buffer($f_sc_TraversableLike__to__scg_CanBuildFrom__O(this$1, cbf))
});
$c_scm_ListBuffer.prototype.size__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.result__O = (function() {
  return this.toList__sci_List()
});
$c_scm_ListBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_ListBuffer$$anon$1().init___scm_ListBuffer(this)
});
$c_scm_ListBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ListBuffer.prototype.length__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ListBuffer.prototype.toStream__sci_Stream = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream()
});
$c_scm_ListBuffer.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_TraversableOnce__addString__scm_StringBuilder__T__T__T__scm_StringBuilder(this$1, b, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_ListBuffer = (function(x) {
  if (this.exported$6) {
    this.copy__p6__V()
  };
  if (this.isEmpty__Z()) {
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    this.scala$collection$mutable$ListBuffer$$start$6 = this.last0$6
  } else {
    var last1 = this.last0$6;
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    last1.tl$5 = this.last0$6
  };
  this.len$6 = ((1 + this.len$6) | 0);
  return this
});
$c_scm_ListBuffer.prototype.max__s_math_Ordering__O = (function(cmp) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_TraversableOnce__max__s_math_Ordering__O(this$1, cmp)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  $f_sc_IterableLike__copyToArray__O__I__I__V(this$1, xs, start, len)
});
$c_scm_ListBuffer.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_ListBuffer.prototype.clear__V = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
});
$c_scm_ListBuffer.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_TraversableOnce__toArray__s_reflect_ClassTag__O(this$1, evidence$1)
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer = (function(xs) {
  _$plus$plus$eq: while (true) {
    var x1 = xs;
    if ((x1 !== null)) {
      if ((x1 === this)) {
        var n = this.len$6;
        xs = $as_sc_TraversableOnce($f_sc_IterableLike__take__I__O(this, n));
        continue _$plus$plus$eq
      }
    };
    return $as_scm_ListBuffer($f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ListBuffer.prototype.reduceLeft__F2__O = (function(op) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $f_sc_LinearSeqOptimized__reduceLeft__F2__O(this$1, op)
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(xs)
});
$c_scm_ListBuffer.prototype.stringPrefix__T = (function() {
  return "ListBuffer"
});
function $is_scm_ListBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ListBuffer)))
}
function $as_scm_ListBuffer(obj) {
  return (($is_scm_ListBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ListBuffer"))
}
function $isArrayOf_scm_ListBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ListBuffer)))
}
function $asArrayOf_scm_ListBuffer(obj, depth) {
  return (($isArrayOf_scm_ListBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ListBuffer;", depth))
}
var $d_scm_ListBuffer = new $TypeData().initClass({
  scm_ListBuffer: 0
}, false, "scala.collection.mutable.ListBuffer", {
  scm_ListBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_ReusableBuilder: 1,
  scm_Builder: 1,
  scg_SeqForwarder: 1,
  scg_IterableForwarder: 1,
  scg_TraversableForwarder: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer.prototype.$classData = $d_scm_ListBuffer;
/** @constructor */
function $c_scm_StringBuilder() {
  $c_scm_AbstractSeq.call(this);
  this.underlying$5 = null
}
$c_scm_StringBuilder.prototype = new $h_scm_AbstractSeq();
$c_scm_StringBuilder.prototype.constructor = $c_scm_StringBuilder;
/** @constructor */
function $h_scm_StringBuilder() {
  /*<skip>*/
}
$h_scm_StringBuilder.prototype = $c_scm_StringBuilder.prototype;
$c_scm_StringBuilder.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___ = (function() {
  $c_scm_StringBuilder.prototype.init___I__T.call(this, 16, "");
  return this
});
$c_scm_StringBuilder.prototype.$$plus$eq__C__scm_StringBuilder = (function(x) {
  this.append__C__scm_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.apply__I__O = (function(idx) {
  var c = this.underlying$5.charAt__I__C(idx);
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_scm_StringBuilder.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_scm_StringBuilder.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  var c = this.underlying$5.charAt__I__C(index);
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  return this.underlying$5.substring__I__I__T(start, end)
});
$c_scm_StringBuilder.prototype.apply__I__C = (function(index) {
  return this.underlying$5.charAt__I__C(index)
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_IndexedSeq$()
});
$c_scm_StringBuilder.prototype.toString__T = (function() {
  return this.underlying$5.java$lang$StringBuilder$$content$f
});
$c_scm_StringBuilder.prototype.foreach__F1__V = (function(f) {
  $f_sc_IndexedSeqOptimized__foreach__F1__V(this, f)
});
$c_scm_StringBuilder.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_scm_StringBuilder.prototype.result__O = (function() {
  return this.underlying$5.java$lang$StringBuilder$$content$f
});
$c_scm_StringBuilder.prototype.append__T__scm_StringBuilder = (function(s) {
  var this$1 = this.underlying$5;
  this$1.java$lang$StringBuilder$$content$f = (("" + this$1.java$lang$StringBuilder$$content$f) + s);
  return this
});
$c_scm_StringBuilder.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.underlying$5.length__I())
});
$c_scm_StringBuilder.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_StringBuilder.prototype.init___I__T = (function(initCapacity, initValue) {
  var this$2 = new $c_jl_StringBuilder().init___I((($uI(initValue.length) + initCapacity) | 0));
  this$2.java$lang$StringBuilder$$content$f = (("" + this$2.java$lang$StringBuilder$$content$f) + initValue);
  $c_scm_StringBuilder.prototype.init___jl_StringBuilder.call(this, this$2);
  return this
});
$c_scm_StringBuilder.prototype.length__I = (function() {
  return this.underlying$5.length__I()
});
$c_scm_StringBuilder.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.sizeHintIfCheap__I = (function() {
  return this.underlying$5.length__I()
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___jl_StringBuilder = (function(underlying) {
  this.underlying$5 = underlying;
  return this
});
$c_scm_StringBuilder.prototype.append__O__scm_StringBuilder = (function(x) {
  var this$2 = this.underlying$5;
  var str = ("" + x);
  this$2.java$lang$StringBuilder$$content$f = (this$2.java$lang$StringBuilder$$content$f + str);
  return this
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_scm_StringBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_StringBuilder.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_StringBuilder.prototype.toArray__s_reflect_ClassTag__O = (function(evidence$1) {
  return $m_sjsr_RuntimeString$().toCharArray__T__AC(this.underlying$5.java$lang$StringBuilder$$content$f)
});
$c_scm_StringBuilder.prototype.append__C__scm_StringBuilder = (function(x) {
  this.underlying$5.append__C__jl_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_IndexedSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_scm_StringBuilder.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_StringBuilder().init___())
});
$c_scm_StringBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_StringBuilder = new $TypeData().initClass({
  scm_StringBuilder: 0
}, false, "scala.collection.mutable.StringBuilder", {
  scm_StringBuilder: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  jl_CharSequence: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1,
  scm_ReusableBuilder: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder.prototype.$classData = $d_scm_StringBuilder;
/** @constructor */
function $c_sjs_js_WrappedArray() {
  $c_scm_AbstractBuffer.call(this);
  this.array$6 = null
}
$c_sjs_js_WrappedArray.prototype = new $h_scm_AbstractBuffer();
$c_sjs_js_WrappedArray.prototype.constructor = $c_sjs_js_WrappedArray;
/** @constructor */
function $h_sjs_js_WrappedArray() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray.prototype = $c_sjs_js_WrappedArray.prototype;
$c_sjs_js_WrappedArray.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.init___ = (function() {
  $c_sjs_js_WrappedArray.prototype.init___sjs_js_Array.call(this, []);
  return this
});
$c_sjs_js_WrappedArray.prototype.apply__I__O = (function(index) {
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_sjs_js_WrappedArray.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_sjs_js_WrappedArray.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  this.array$6.push(elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sjs_js_WrappedArray$()
});
$c_sjs_js_WrappedArray.prototype.foreach__F1__V = (function(f) {
  $f_sc_IndexedSeqOptimized__foreach__F1__V(this, f)
});
$c_sjs_js_WrappedArray.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_sjs_js_WrappedArray.prototype.result__O = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.array$6.length))
});
$c_sjs_js_WrappedArray.prototype.seq__scm_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sjs_js_WrappedArray.prototype.length__I = (function() {
  return $uI(this.array$6.length)
});
$c_sjs_js_WrappedArray.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.sizeHintIfCheap__I = (function() {
  return $uI(this.array$6.length)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  this.array$6.push(elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sjs_js_WrappedArray.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_sc_IndexedSeqOptimized__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_WrappedArray.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sjs_js_WrappedArray.prototype.init___sjs_js_Array = (function(array) {
  this.array$6 = array;
  return this
});
$c_sjs_js_WrappedArray.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_IndexedSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_sjs_js_WrappedArray.prototype.stringPrefix__T = (function() {
  return "WrappedArray"
});
function $is_sjs_js_WrappedArray(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_WrappedArray)))
}
function $as_sjs_js_WrappedArray(obj) {
  return (($is_sjs_js_WrappedArray(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.WrappedArray"))
}
function $isArrayOf_sjs_js_WrappedArray(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_WrappedArray)))
}
function $asArrayOf_sjs_js_WrappedArray(obj, depth) {
  return (($isArrayOf_sjs_js_WrappedArray(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.WrappedArray;", depth))
}
var $d_sjs_js_WrappedArray = new $TypeData().initClass({
  sjs_js_WrappedArray: 0
}, false, "scala.scalajs.js.WrappedArray", {
  sjs_js_WrappedArray: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1
});
$c_sjs_js_WrappedArray.prototype.$classData = $d_sjs_js_WrappedArray;
/** @constructor */
function $c_scm_ArrayBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.initialSize$6 = 0;
  this.array$6 = null;
  this.size0$6 = 0
}
$c_scm_ArrayBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ArrayBuffer.prototype.constructor = $c_scm_ArrayBuffer;
/** @constructor */
function $h_scm_ArrayBuffer() {
  /*<skip>*/
}
$h_scm_ArrayBuffer.prototype = $c_scm_ArrayBuffer.prototype;
$c_scm_ArrayBuffer.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_ArrayBuffer = (function(elem) {
  var n = ((1 + this.size0$6) | 0);
  $f_scm_ResizableArray__ensureSize__I__V(this, n);
  this.array$6.set(this.size0$6, elem);
  this.size0$6 = ((1 + this.size0$6) | 0);
  return this
});
$c_scm_ArrayBuffer.prototype.init___ = (function() {
  $c_scm_ArrayBuffer.prototype.init___I.call(this, 16);
  return this
});
$c_scm_ArrayBuffer.prototype.apply__I__O = (function(idx) {
  return $f_scm_ResizableArray__apply__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.lengthCompare__I__I = (function(len) {
  return $f_sc_IndexedSeqOptimized__lengthCompare__I__I(this, len)
});
$c_scm_ArrayBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $f_sc_IndexedSeqOptimized__sameElements__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayBuffer.prototype.apply__O__O = (function(v1) {
  var idx = $uI(v1);
  return $f_scm_ResizableArray__apply__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.isEmpty__Z = (function() {
  return $f_sc_IndexedSeqOptimized__isEmpty__Z(this)
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ArrayBuffer$()
});
$c_scm_ArrayBuffer.prototype.foreach__F1__V = (function(f) {
  $f_scm_ResizableArray__foreach__F1__V(this, f)
});
$c_scm_ArrayBuffer.prototype.toBuffer__scm_Buffer = (function() {
  return $f_sc_IndexedSeqLike__toBuffer__scm_Buffer(this)
});
$c_scm_ArrayBuffer.prototype.result__O = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.size0$6)
});
$c_scm_ArrayBuffer.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $f_scm_Builder__sizeHintBounded__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ArrayBuffer.prototype.init___I = (function(initialSize) {
  this.initialSize$6 = initialSize;
  $f_scm_ResizableArray__$$init$__V(this);
  return this
});
$c_scm_ArrayBuffer.prototype.length__I = (function() {
  return this.size0$6
});
$c_scm_ArrayBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.sizeHintIfCheap__I = (function() {
  return this.size0$6
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer = (function(xs) {
  if ($is_sc_IndexedSeqLike(xs)) {
    var x2 = $as_sc_IndexedSeqLike(xs);
    var n = x2.length__I();
    var n$1 = ((this.size0$6 + n) | 0);
    $f_scm_ResizableArray__ensureSize__I__V(this, n$1);
    x2.copyToArray__O__I__I__V(this.array$6, this.size0$6, n);
    this.size0$6 = ((this.size0$6 + n) | 0);
    return this
  } else {
    return $as_scm_ArrayBuffer($f_scg_Growable__$$plus$plus$eq__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $f_scm_ResizableArray__copyToArray__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayBuffer.prototype.sizeHint__I__V = (function(len) {
  if (((len > this.size0$6) && (len >= 1))) {
    var newarray = $newArrayObject($d_O.getArrayOf(), [len]);
    $systemArraycopy(this.array$6, 0, newarray, 0, this.size0$6);
    this.array$6 = newarray
  }
});
$c_scm_ArrayBuffer.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_ArrayBuffer.prototype.reduceLeft__F2__O = (function(op) {
  return $f_sc_IndexedSeqOptimized__reduceLeft__F2__O(this, op)
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer(xs)
});
$c_scm_ArrayBuffer.prototype.stringPrefix__T = (function() {
  return "ArrayBuffer"
});
function $is_scm_ArrayBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuffer)))
}
function $as_scm_ArrayBuffer(obj) {
  return (($is_scm_ArrayBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuffer"))
}
function $isArrayOf_scm_ArrayBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuffer)))
}
function $asArrayOf_scm_ArrayBuffer(obj, depth) {
  return (($isArrayOf_scm_ArrayBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuffer;", depth))
}
var $d_scm_ArrayBuffer = new $TypeData().initClass({
  scm_ArrayBuffer: 0
}, false, "scala.collection.mutable.ArrayBuffer", {
  scm_ArrayBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1,
  scm_ResizableArray: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer.prototype.$classData = $d_scm_ArrayBuffer;
$e.Main = $m_Lorg_rebeam_Main$();
//# sourceMappingURL=scalajs-react-electron-forge-fastopt.js.map
