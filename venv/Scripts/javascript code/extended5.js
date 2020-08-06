// these are a series of extended precision arithmetic routines
// that do RSA public key encryption in Javascript
// 
// Copyright 2005  Paul Cheffers paul@securecottage.com
// Version 3
// set Press' "Numerical Recipes" for algorithms

var SCmaxx = 256*256-1;
var SCmaxxx = 256*256;

var SCnumbersize = 64; // multiply by 16 to get bitsize

var SCdofouriermultiply = true;
var SCproduction = false;

function multiply(a,b,size)
{
  
	if(SCdofouriermultiply)
	   return fouriermultiply(a,b,size);
	else return nsquaredmultiply(a,b,size);
	
}


function zeronum(size)
{ 

  var bignum = new Array();
  var i;
  for(i=0;i<size;i++)
    bignum[i] = 0;
  return bignum;
}
function onenum(size)
{
   var ret = zeronum(size);
   ret[size-1] = 1;
   return ret;
}
function hexnum(st)
{
    var size=SCnumbersize;
    var bignum = new Array();
    var i,j;
    var debug=0;
    var hexchars = "0123456789abcdef";
    var zeros="";
    var stri="";
    var pads=0;

    for(i=0;i<size;i++)
       bignum[i] = 0;

    pads = (st.length)%4;

    if(pads != 0)
    {
       zero = "";
       while(pads-- >0)
       {
         zero += "0";
       }
       stri = zero + st;   
    }
    else stri = st;

    
    for(j=size-1,i=stri.length-4;j>=0&&i>=0;i-=4,j--)
    {
       bignum[j] = (hexchars.indexOf(stri.substring(i,i+1))*16 +
                   hexchars.indexOf(stri.substring(i+1,i+2)))*256   + 
                   hexchars.indexOf(stri.substring(i+2,i+3))*16 +
                   hexchars.indexOf(stri.substring(i+3,i+4));
    }
    return bignum;
 
}
// put 8 random numbers into beginning of number
// to make same strings come up with different ciphertext
//
// disable this for the demo.
function intonum(str1)
{
    var size=SCnumbersize;
    var bignum = new Array();
    var i,j;
    var debug=0;
    var oddlength=0;
    var str;

    str = str1;

    var randomString="";
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=:;";
    var i;

    var randomString = "";
	if(SCproduction)
      for(i=0;i<8;i++)
          randomString += alphabet.charAt(Math.floor(Math.random()*78));
	
    str = randomString + str;
   

    for(i=0;i<size;i++)
       bignum[i] = 0;
    
    for(j=size-1,i=str.length-2;j>=0&&i>=0;i-=2,j--)
    {
       bignum[j] = str.charCodeAt(i)*256 +
                   str.charCodeAt(i+1);
         
    }
    // put in eight random numbers
    
    // if odd length
   
    if(str.length%2==1 && j > 0)
    {
      bignum[j] = str.charCodeAt(0);
      j--;
    }
//    for(i=j,j=4;i >= 0&&j>0 ;i--,j--)
//    {
//       bignum[i] = Math.floor(Math.random()*256)*256 + Math.floor(Math.random()*256);
//    }
	
    return bignum;

}

function tohex(bignum)
{
   return tohex1(bignum,SCnumbersize);
}
function tohex128(bignum)
{
   return tohex1(bignum,128);
}
function tohex1(bignum,size)
{
   var i,j;
   var high;
   var low;
   var one,two;
   var hexnumbers = "0123456789abcdef";
   var result="";
   var trunc = 0;
   if(trunc == 1)
   {
    for(i=0;i<size;i++)
      if(bignum[i] != 0)
        break;
    if(i == size)
      return "00";
   }
   else i=0;
   for(;i<size;i++)
   {
     high = Math.floor(bignum[i]/256);
     low = bignum[i]%256;
     one = Math.floor(high/16);
     two = high%16;
     result += hexnumbers.substring(one,one+1) + hexnumbers.substring(two,two+1);
     one = Math.floor(low/16);
     two = low%16;
     result += hexnumbers.substring(one,one+1) + hexnumbers.substring(two,two+1);
   }
   // strip beginning zeros off number
   for(i=0;i<result.length;i++)
       if(result.charAt(i) != '0')
          break;
   if(i == result.length)
      return("00");
   else result = result.substr(i,result.length);

   return result;
}
function fromnum(bignum)
{
   var i;
   var retString="";
   var high;
   var low;
   var size=SCnumbersize;
   for(i=0;i<size;i++)
      if(bignum[i] != 0)
         break;
   if(i==size) return("0");
   for(;i<size;i++)
   {
      high = Math.floor(bignum[i]/256); 
      low = bignum[i]%256;
      retString += String.fromCharCode(high) + String.fromCharCode(low);
   }
   return retString;

}

function add(bignum1,bignum2,size)
{
    var i;
    var c=0;
    //var maxx = 256*256-1;
    var debug=0;
    for(i=size-1;i>=0;i--)
    {
        bignum1[i] += bignum2[i] + c;
        if(bignum1[i] > SCmaxx)
        {
           c = Math.floor(bignum1[i] / (SCmaxxx));
           bignum1[i] = bignum1[i] % (SCmaxxx);
        }
        else c = 0;
    }
    // could have carry before beginning of big number.
    return bignum1;
     
}
function minus(bignum1,bignum2,size)
{
    var i;
    var c=0;
    //var maxx = 256*256-1;
    var debug=0;
    
    for(i=size-1;i>=0;i--)
    {
        if(bignum1[i] >= (bignum2[i] + c))
        {
          bignum1[i] -= (bignum2[i] + c);
          c = 0;
        }
        else
        {
          bignum1[i]+=SCmaxxx;
          bignum1[i] -= (bignum2[i] + c); 
          c = 1;
        }

    }
    
    // could have carry before beginning of big number.
    return bignum1;

}
// code changed but based on Dave Shapiro's BigInt Javascript routine
function nsquaredmultiply(bignum1,bignum2,size)
{
    var i,j,k,uv,c;
    var result = zeronum(2*size);
    var maxx = 256*256-1;
    var maxxx = 256*256;
    var debug=0;
 
    for(i=0;i<size;i++)
      if(bignum1[i]!=0)
         break;
    if(i == size)
         return result;

    var endi = i-1;
    if(endi < 0)
        endi = 0;
		
    for(j=0;j<size;j++)
      if(bignum2[j]!=0)
         break;
    if(j == size)
         return result;
		 
    var endj = j-2;
    if(endj < 0)
        endj = 0;

    for(i=size-1;i>=endi;i--)
    {
       c = 0;
       k = size+i;
       for(j=size-1;j>=endj;j--,k--)
       {
          uv = result[k] + bignum1[i]*bignum2[j] + c;
          result[k] = uv & maxx;
          c = Math.floor(uv / maxxx);
       }
       result[k] = c;
    }
    return result;
}
function comparezero(bignum,size)
{
    var i;
    var debug=0;  
    for(i=size-1;i>=0;i--)
    {
       if(bignum[i]!=0)
         return 0;
    }
    return 1;
}
function copynum(bignum,size)
{
    var i;
    var retnum = new Array()
    for(i=0;i<size;i++)
      retnum[i] = bignum[i];
    return retnum; 
}

function todecimal(bignum1,size)
{
    var retString="";
    var ir;
    var nums="0123456789";
    var bignum = copynum(bignum1,size);
    var debug=0;
    if(comparezero(bignum,size)==1)
       return "0";
    
    while(comparezero(bignum,size)==0)
    {
       ir = sdivide(bignum,size,10);
       retString = nums.substring(ir,ir+1) + retString;
    }

    return retString;
}
function fromdecimal32(str)
{
   return fromdecimal1(str,32);
}
function fromdecimal(str)
{
   return fromdecimal1(str,numbersize);
}
function fromdecimal1(str,size)
{
   //var size=64;
   var bignum = zeronum(size);
   var nums = "0123456789";
   var i;
   var index;
   var debug=0;
   for(i=0;i<str.length;i++)
   {
     index = nums.indexOf(str.charAt(i))
     if(index == -1)
       continue;
     smultiply(bignum,size,10);
     bignum[size-1]+=index;  
   }
   return bignum;
}
function sdivide(bignum,size,dividend)
{
   var remainder=0,i,quotient,temp;
   //var maxx=256*256;

   for(i=0;i<size;i++)
   {
      temp = bignum[i] + remainder*SCmaxxx; 
      quotient = Math.floor(temp/dividend);
      remainder = temp%dividend; 
      bignum[i] = quotient;
   }
   return ir;
}
function smultiply(bignum,size,shortinteger)
{
    var remainder=0,j,high,low;
    //var maxx=256*256-1;

    for(j=size-1;j>=0;j--)
    {
       remainder = bignum[j]*shortinteger+remainder;
       bignum[j] = remainder & SCmaxx;
       remainder = remainder >> 16;
    } 
    return remainder;
}

function inverse(bignum1,size,inversesize)
{
    // get an initial approximation by floats
   
    var i,j,adds=4,temp;
    //var maxx=256*256;
    var bignuminv,oldtwo,two = zeronum(size+2);
   
 
    // increase size of all numbers by 4
    var bignum = zeronum(size+adds);

    
    
    for(i=adds,j=0;i<size+adds;i++,j++)
        bignum[i] = bignum1[j];
    size += adds;
	
	
	 var inv = zeronum(size);
	 var startc=0;
	 for(i=0;i<size;i++)
	    if(bignum[i] == 0)
		   startc++;
		else break;
	 var reciprocal1 = Math.floor((1/bignum[startc])*256*256*256*256);
			
     inv[size/2-1] = reciprocal1;
		
	
	//alert("here multiply "+(multiply(bignum,inv,size)).length);
	
    // u_i+1 = u_i(2-u_i*v) -- newton's method to inverse a number

  
    for(i=0;i<size;i++)  // just to limit the loop
    { 
         
      bignuminv = lowtrunc(multiply(bignum,inv,size),size*2);
      
       oldtwo = copynum(two,size);
       for(j=0;j<size;j++)
          two[j] = 0;
       two[0] = 2;
     
       minus(two,bignuminv,size);
       inv = fractrunc(multiply(inv,two,size),size*2); 
	          
       if(equal(two,oldtwo,size)==1)
        break; 
    }
     
    // the first element is the integer component, get rid of it
    for(j=0;j<size-adds;j++)
    {
       inv[j] = inv[j+1];
    }
        
    return inv; 
}
function thesize(bignum,size)
{
    var i;
    for(i=0;i<size;i++)
       if(bignum[i] !=0)
         return size-i;
    return size; 
}
function move(bignum,size,tomove)
{
   var retnum = zeronum(size);
   var i;
   for(i=0;i<tomove;i++)
      retnum[i] = bignum[i];
   return retnum; 
}

function remainder(bignum1,bignum2,size)
{
    var debug=0;
    var i,j;
    var s1 = thesize(bignum1,size);
    var s2 = thesize(bignum2,size);
    var retnum = copynum(bignum1,size);
    // if bignum1 less than the modulus
    
    if(s1 < s2)
      return retnum;
 
    var invert = inverse(bignum2,size,size);
    
    var quotient = hightrunc(multiply(invert,bignum1,size),size*2);
  
    var remainder = lowtrunc(multiply(bignum2,quotient,size),size*2);
    minus(retnum,remainder,size);
    return retnum;  // return remainder, quotient is uninteresting

}
function remainderwithinverse(bignum1,bignum2,size,invert)
{
    var debug=0;
    var i,j;
    var s1 = thesize(bignum1,size);
    var s2 = thesize(bignum2,size);
    var retnum = copynum(bignum1,size);
    // if bignum1 less than the modulus
    
    if(s1 < s2)
      return retnum;
       
    var quotient = hightrunc(multiply(invert,bignum1,size),size*2);
    var remainder = lowtrunc(multiply(bignum2,quotient,size),size*2);
    minus(retnum,remainder,size);
    return retnum;  // return remainder, quotient is uninteresting

}
function equal(bignum1,bignum2,size)
{
   var i,j;
   var debug=0;
   for(i=0;i<size;i++)
   {
      if(bignum1[i] != bignum2[i])
        return 0;
   }
   return 1; 
}
// the first element is ignored
// compare 2 to size+1 for zeroes
function comparefraction(bignum,size)
{
  var i;
  for(i=1;i<size+1;i++)
     if(bignum[i] != 0)
        return 1
  return 0;
}
var abcd=1;
function lowtrunc(bignum,size)
{

   var i = size/2;
   var j,k;
   var retnum = zeronum(i);

   for(k=0,j=i;j<size;j++,k++)
   {
      retnum[k] = bignum[j];

   }
      
 //  alert("here retnum "+retnum);   
   return retnum;   
}
function hightrunc(bignum,size)
{
    var i=size/2;
    var j,k;
    var retnum = zeronum(i);
    for(j=0;j<i;j++)
       retnum[j] = bignum[j];
    return retnum;
}
function fractrunc(bignum,size)
{
     var i=size/2;
     var j,k;
     var retnum = zeronum(i);
     for(j=1;j<i+1;j++)
        retnum[j-1]=bignum[j];
     return retnum;
}

function shiftright(bignum,size)
{
   var i;
   var c=0;
   var maxx = (SCmaxxx)/2;
   var debug=0;
   for(i=size-1;i>=0;i--)
   {
      bignum[i] = Math.floor(bignum[i]/2);
      if(i-1 >= 0)
      {
        if((bignum[i-1] & 1) == 1)
            bignum[i] += maxx;
      }
   } 
}
function modulusinverse(modulus,size)
{
    var m=zeronum(size*2);
    var i,j,k;
    var debug=0;
	
	// if modinverse is a javascript variable
	if(typeof modinverse != "undefined" && modinverse != "")
	{
		var invert1 = hexnum1(modinverse,SCnumbersize*2);	
		
		return invert1;
	}
    
    for(j=0,i=size;i<size*2;i++,j++)
       m[i] = modulus[j];
	
	   
    var invert = inverse(m,size*2,size*2);
	//alert(invert);	
    return invert;
}
function modpowwithinverse(message,exponent,modulus,invert,size)
{
    var r=zeronum(size);
    r[size-1] = 1;
    var s=copynum(message,size);
    var e=copynum(exponent,size);
    var m=zeronum(size*2);
    var i,j,k;
    var debug=0;
    var odd = 0;
	
	var atime,thetime;
	
    atime = new Date;
    thetime = atime.getTime();

    for(j=0,i=size;i<size*2;i++,j++)
       m[i] = modulus[j];

    while(comparezero(e,size)==0)
    {
       odd = e[size-1] & 1;
       shiftright(e,size);
       if(odd == 1)
       {
         r = multiply(r,s,size);   
         r = remainderwithinverse(r,m,size*2,invert);
         r = lowtrunc(r,size*2);
       }
       s = multiply(s,s,size);
       s = remainderwithinverse(s,m,size*2,invert);
       s = lowtrunc(s,size*2);
       
    }
	if(document.getElementById("timetorun") && !SCproduction)
	{
     var btime = new Date;
     document.getElementById("timetorun").innerHTML=
	     "milliseconds to encrypt(Javascript):" + (btime.getTime()-atime.getTime());
    }
    return r;
}


function modpow(message,exponent,modulus,size)
{
    var r=zeronum(size); 
    r[size-1] = 1;
    var s=copynum(message,size);
    var e=copynum(exponent,size);
    var m=zeronum(size*2);
   
    var i,j,k;
    var debug=0;
    var odd = 0;
	var atime,thetime;
	
     atime = new Date;
     thetime = atime.getTime();
   
    for(j=0,i=size;i<size*2;i++,j++)
       m[i] = modulus[j];
	
	
	
    var invert = inverse(m,size*2,size*2);
   
    
    while(comparezero(e,size)==0)
    {
       odd = e[size-1] & 1;
       shiftright(e,size);
       if(odd == 1)
       {
         r = multiply(r,s,size);   
         r = remainderwithinverse(r,m,size*2,invert);
         r = lowtrunc(r,size*2);
       }
       s = multiply(s,s,size);
       s = remainderwithinverse(s,m,size*2,invert);
       s = lowtrunc(s,size*2);
       
    }
    if(document.getElementById("timetorun") && !SCproduction)
	{
     var btime = new Date;
     document.getElementById("timetorun").innerHTML=
	     "milliseconds to encrypt(Javascript):" + (btime.getTime()-atime.getTime());
    }
	

    return r;
}

if(SCdofouriermultiply)
  document.write('<script src="fouriermultiply1.js"></script>');