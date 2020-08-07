// Copyright 2004 Paul Cheffers pchef@iinet.net.au
// works on Netscape and NOT IE.
// requires Java but does not use an applet

function generatekeys()
{
     
     var rand = new Packages.java.util.Random();
     var retString;
     var certainty=24;
     var bSuccess = 0;
     var p,q,m,tot,temp;
     var one = new Packages.java.math.BigInteger("1");
     var e = new Packages.java.math.BigInteger("23");
   while(bSuccess == 0)
   {

     rand = new Packages.java.util.Random();
     
     p = new Packages.java.math.BigInteger(512,certainty,rand);
     rand = new Packages.java.util.Random();
     rand = new Packages.java.util.Random();
     q = new Packages.java.math.BigInteger(512,certainty,rand);
     p = p.abs();
     q = q.abs();
     m = p.multiply(q);
     p = p.subtract(one);
     q = q.subtract(one);
     tot = p.multiply(q);
     tot = tot.abs();
     temp = e.gcd(tot);
     if(temp.equals(one) == true)
     {
       bSuccess = 1;
     }
   }

     d = e.modInverse(tot);

     retString = e.toString(10) + "Z" + d.toString(10) + "Z" +
                 m.toString(10);
     return retString;
     
}
  
  function rsaencrypt(message, e, m)
  {
     var messagebytes;
     var ekey, modulus, plaintext, ciphertext;
     if(message.length == 0)
        return "";
     ekey = new Packages.java.math.BigInteger(e,10);
     modulus = new Packages.java.math.BigInteger(m,10);
     messagebytes = new Packages.java.lang.String(message);
     plaintext = new Packages.java.math.BigInteger(messagebytes.getBytes());
     ciphertext = plaintext.modPow(ekey,modulus);
     return ciphertext.toString(10);
  }
  function rsadecrypt(cipher, d, m)
  {
      if(cipher.length == 0)
         return "";
      var plaintextbytes="";
      var plaintexthex;
      var i;
      var dkey, modulus, ciphertext;
     
      dkey = new Packages.java.math.BigInteger(d,10);
      modulus = new Packages.java.math.BigInteger(m,10);
      ciphertext = new Packages.java.math.BigInteger(cipher,10);
      plaintext = ciphertext.modPow(dkey,modulus);
      // Communicator requires the following code, Versions 6 and 7 do not. 
      // remember that plaintexthex is a Java String not a Javascript String.
      plaintexthex = plaintext.toString(16);
      for(i=0;i<plaintexthex.length();i+=2)
      {
         plaintextbytes += fromHex(plaintexthex.substring(i,i+2));
      }
      return plaintextbytes;
  }

  var hexchars="0123456789abcdef";
  // take two ascii hex numbers and convert them to a Javascript character
  function fromHex(str)
  {
    var high=str.substring(0,1);
    var low=str.substring(1,2);
    return String.fromCharCode((16*hexchars.indexOf(high))+hexchars.indexOf(low));
  }
  
// Copyright 2005, Paul Cheffers
// baudot@airnet.com.au
//
// see Press' "Numerical Recipes" for algorithms.


var swaps = new Array;
var trigs = new Array;

function Complex(re,im)
{
	this.re = re;
	this.im = im;
	
}
Complex.prototype.switchit = cswitchit;
Complex.prototype.fourier = cfourier;
Complex.prototype.multiply = cmultiply;
Complex.prototype.multiply1 = cmultiply1;
Complex.prototype.plus = cplus;
Complex.prototype.plus2 = cplus2;
Complex.prototype.minus = cminus;
Complex.prototype.minus2 = cminus2;
Complex.prototype.addconjugate2 = caddconjugate2;
Complex.prototype.minusconjugate2 = cminusconjugate2;
Complex.prototype.conjugate = cconjugate;
Complex.prototype.realmultiply = crealmultiply;
Complex.prototype.imaginarymultiply = cimaginarymultiply;
Complex.prototype.trigometricincrement = ctrigometricincrement;
Complex.prototype.trigometricincrement2 = ctrigometricincrement2;
Complex.prototype.equal = cequal;



function cswitchit(switcher)
{
	   
	var temp;
	temp = switcher.re;
	switcher.re = this.re;
	this.re = temp;
	
	temp = switcher.im;
	switcher.im = this.im;
	this.im = temp;
}
var wm = new Complex(0.0,0.0);

function cfourier(odd,w)
{		
			wm.multiply(odd,w);
			odd.minus2(this,wm);
			this.plus(wm);			
}


function cmultiply(b,w)
{
	
	this.re = w.re*b.re - w.im*b.im;
	this.im = w.re*b.im + w.im*b.re;
}
function cmultiply1(a)
{
	var re,im;
    re = this.re*a.re - this.im*a.im;
	im = this.re*a.im + this.im*a.re;
    this.re = re;
	this.im = im;
}
function cplus(b)
{
	this.re += b.re;
	this.im += b.im;
}
function cplus2(a,b)
{
	this.re = a.re + b.re;
	this.im = a.im + b.im;
}

function cminus(b)
{
	this.re -= b.re;
	this.im -= b.im;
}
function cminus2(a,b)
{
	this.re = a.re - b.re;
	this.im = a.im - b.im;
}
function ctrigometricincrement(wp)
{
		   var temp;
           temp=this.re;
		   this.re -= this.re*wp.re + this.im*wp.im;
		   this.im += temp*wp.im - this.im*wp.re;
}
function ctrigometricincrement2(a,wp)
{
		   this.re = a.re - (a.re*wp.re + a.im*wp.im);
		   this.im = a.im + (a.re*wp.im - a.im*wp.re);
}

function crealmultiply(real)
{
	this.re *= real;
	this.im *= real;
}
function cimaginarymultiply(im)
{
	var temp = this.re;
	this.re = -1*(this.im*im);
	this.im = temp*im;
}
function caddconjugate2(a,b)
{
	this.re = a.re + b.re;
	this.im = a.im - b.im;
}
function cminusconjugate2(a,b)
{
	this.re = a.re - b.re;
	this.im = a.im + b.im;
}
function cconjugate()
{
	this.im = - this.im;
}
function cequal(a)
{
	this.re = a.re;
	this.im = a.im;
}
var unwindX = new Complex(0.0,0.0);
var unwindY = new Complex(0.0,0.0);
function unwindreal(complexesI,complexesJ,even,odd,w)
{
	 unwindX.addconjugate2(complexesI,complexesJ);
	 unwindX.realmultiply(even);
	 unwindY.minusconjugate2(complexesI,complexesJ);
	 unwindY.imaginarymultiply(odd);
	 unwindY.multiply1(w);
	 complexesI.minus2(unwindX,unwindY);
	 complexesJ.plus2(unwindX,unwindY);
	 complexesJ.conjugate();
}
	 


function fourier2(complexesA,complexesB,size,direction)
{
   var binlength,bin,j,binincrement,i,k,temp,theta,bitreverse,length,temp,trigmultiplier;
   
   if(typeof(swaps[size]) == "undefined")
   {
	   swaps[size] = new Array(size);   
	   for(i=0;i<size;i++,bitreverse=0,length=size/2,j=i)
	   {
		  while(length > 0)
		  {
			  if (j % 2 == 1)
				bitreverse += length;
			  j >>= 1;
			  length >>= 1;
		  }
			swaps[size][i] = bitreverse;
	   }
   }
   for(i=0;i<size;i++)
   {
	   try
	   {
	    index = swaps[size][i];
	   }catch(e)
	   {
		   swaps[size] = new Array(size);   
		   for(i=0;i<size;i++,bitreverse=0,length=size/2,j=i)
		   {
			  while(length > 0)
			  {
				  if (j % 2 == 1)
					bitreverse += length;
				  j >>= 1;
				  length >>= 1;
			  }
				swaps[size][i] = bitreverse;
		   }
	   }
		if(index > i)
		{
		  complexesA[i].switchit(complexesA[index]);
		  if(complexesB != null)
		    complexesB[i].switchit(complexesB[index]);
		}  
		index = swaps[size][i];
    }
	
   
   if(typeof trigs[size*direction] == "undefined")
   {
	  var wp = new Complex(0.0,0.0);
	  theta = direction*(6.28318530717959/size);
      temp = Math.sin(0.5*theta);
		
      wp.re = 2.0*temp*temp;
      wp.im = Math.sin(theta);
	  var warray = new Array(size/2);

	  warray[0] = new Complex(1.0,0.0);
	  for(k=1;k<size/2;k++)
	  {
		 warray[k] = new Complex(0.0,0.0);
	     warray[k].trigometricincrement2(warray[k-1],wp); 
	  }
	  trigs[size*direction] = warray;

   }

   var warray = trigs[size*direction];	 
 
   for(binlength=1,trigmultiplier=size/2;binlength < size;binlength *= 2, trigmultiplier/=2)
   {
	   
	  for(bin=0;bin<size;bin+=binlength*2)
		  for(i=bin,j=bin+binlength,k=0;i<bin+binlength;i++,j++,k+=trigmultiplier)
		  {   
				complexesA[i].fourier(complexesA[j], warray[k]);   
				if(complexesB != null)
				  complexesB[i].fourier(complexesB[j], warray[k]);   
		  }
		
   }
		  

}

function fouriermultiply(c,d,sizec)
{
 
   var i,j,k,sized=sizec,fouriersize=1,sizecd,cstart=0,dstart=0,carry,temp,cf,df;
   
   for(i=0;i<sizec;i++)
     if(c[i] == 0)
	    cstart++;
	 else break;
   if(cstart % 2 == 1)
	    cstart--;
   for(i=0;i<sized;i++)
     if(d[i] == 0)
	    dstart++;
	 else break;
	if(dstart % 2 == 1)
	    dstart--;

   

   var product = new Array(sizec+sized);
 
   var sizecd = ((sized-dstart) + (sizec-cstart))/2
	
	
	
   while(fouriersize<sizecd)fouriersize*=2;
	
   cf = new Array(fouriersize);
   df = new Array(fouriersize);
   

   for(j=0,i=cstart;i<sizec;j++,i+=2) 
	   cf[j] = new Complex(c[i],c[i+1]);
   
   
   for(;j<=fouriersize;j++)
	   cf[j] = new Complex(0.0,0.0);
  
   for(j=0,i=dstart;i<sized;j++,i+=2)
	    df[j] = new Complex(d[i],d[i+1]);
   
   for(;j<=fouriersize;j++)
	    df[j] = new Complex(0.0,0.0);
		
   convolution(df,cf,fouriersize);
         
   carry=0.0;
 
   var maxx=256.0*256.0;
   var leastsignificant = sizec+sized;
   var leastsignificantfourier = sizecd;
   var placein=false;
   
   
   
	k=leastsignificant; 
	
   for(j=fouriersize-1;
	   j>=0;
	   j--)
   {
	 if(!placein && j<leastsignificantfourier)
	    placein = true;
	     
     temp=df[j].im+carry+0.5;
     carry=Math.floor(temp/maxx)
	 if(placein)
       product[k--]=Math.floor(temp-carry*maxx);
	 
	 temp=df[j].re+carry+0.5
	 carry=Math.floor(temp/maxx);
	 if(placein)
	   product[k--]=Math.floor(temp-carry*maxx);
   }
   product[k--]=Math.floor(carry);
   for(;k>=0;k--)
      product[k] = 0.0;

   if(carry>=maxx) alert("an error has occured in multiply");
   
  
  return product; 
   
}

function convolution(complexesA,complexesB,size)
{
  var i,j,temp,even=0.5,odd=0.5,theta;
  var cached = "rr" + size;
  var cachedinverse = "rr" + (-size);
  var debug=false;

  theta=(3.141592653589793/size);
  
  fourier2(complexesA,complexesB,size,1);
  
  if(typeof trigs[cached] == "undefined")
   {
	  var warray = new Array(size/2);
	  var warrayinverse = new Array(size/2);
      temp=Math.sin(0.5*theta);
	  var wp = new Complex(2.0*temp*temp,Math.sin(theta));
	  var wpinverse = new Complex(wp.re,-wp.im);
    
	  warray[0] = new Complex(1.0-wp.re,wp.im);
	  warrayinverse[0] = new Complex(1.0-wpinverse.re,wpinverse.im);
	  for(k=1;k<size/2;k++)
	  {
		 warray[k] = new Complex(0.0,0.0);
	     warray[k].trigometricincrement2(warray[k-1],wp); 
		 warrayinverse[k] = new Complex(0.0,0.0);
	     warrayinverse[k].trigometricincrement2(warrayinverse[k-1],wpinverse); 
	  }
	  trigs[cached] = warray;
	  trigs[cachedinverse] = warrayinverse;

   }

  var warray = trigs[cached];	 
  var warrayinverse = trigs[cachedinverse];

    
  var x = new Complex(0.0,0.0);
  var y = new Complex(0.0,0.0);

  
  for(i=size/2-1,j=size/2+1;i>0;i--,j++)
  {
     unwindreal(complexesA[i],complexesA[j],even,odd,warray[i-1]);
     unwindreal(complexesB[i],complexesB[j],even,odd,warray[i-1]);
	 complexesA[i].multiply1(complexesB[i]);
	 complexesA[j].multiply1(complexesB[j]);
	 unwindreal(complexesA[i],complexesA[j],even,-odd,warrayinverse[i-1]);
  }
      complexesA[size/2].multiply1(complexesB[size/2]);
  
      // do f(0) and f(n/2) frequencies
	  // f(0) = f(n/2)
	  var xtemp = new Complex(0.0,0.0),ytemp= new Complex(0.0,0.0);
	  var nw = new Complex(1.0,0.0);
	  xtemp.equal(complexesA[0]);
	  ytemp.equal(complexesA[0]);
	  unwindreal(xtemp,ytemp,even,odd,nw);
	  
	  complexesA[0].re = xtemp.re;
	  complexesA[0].im = ytemp.re;
	  
	  xtemp.equal(complexesB[0]);
      ytemp.equal(complexesB[0]);
	  unwindreal(xtemp,ytemp,even,odd,nw);
	  complexesB[0].re = xtemp.re;
	  complexesB[0].im = ytemp.re;
	  
	  complexesA[0].re *= complexesB[0].re;
	  complexesA[0].im *= complexesB[0].im;
	  	  
	  xtemp.equal(complexesA[0]);
	  ytemp.equal(complexesA[0]);
	  unwindreal(xtemp,ytemp,even,-odd,nw);
	  complexesA[0].im = xtemp.re/2;
	  complexesA[0].re = ytemp.re/2;
	  
	  fourier2(complexesA,null,size,-1);
	 
	  // normalize
	  for(i=0;i<size;i++)
	  {
		  complexesA[i].re/=size;
		  complexesA[i].im/=size;
	  }

  
}

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
	// if(document.getElementById("timetorun") && !SCproduction)
	// {
    //  var btime = new Date;
    //  document.getElementById("timetorun").innerHTML=
	//      "milliseconds to encrypt(Javascript):" + (btime.getTime()-atime.getTime());
    // }
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
    // if(document.getElementById("timetorun") && !SCproduction)
	// {
    //  var btime = new Date;
    //  document.getElementById("timetorun").innerHTML=
	//      "milliseconds to encrypt(Javascript):" + (btime.getTime()-atime.getTime());
    // }
	

    return r;
}


  
var secs;
var timerID = null;
var timerRunning = false;
var delay = 1000;

function InitializeTimer(time)
{
    // Set the length of the timer, in seconds
    ////alert("message after "+time+" minutes");
    secs = parseInt(time) * 60;
    StopTheClock();
    StartTheTimer();
}

function StopTheClock()
{
    if(timerRunning)
        clearTimeout(timerID);
    timerRunning = false;
}

function StartTheTimer()
{
    if (secs==0)
    {
        StopTheClock();
        //////InitializeTimer();
        // Here's where you put something useful that's
        // supposed to happen after the allotted time.
        // For example, you could display a message:
        alert("Please save the changes.\nYour session will be expired within 10 minutes");
    }
    else
    {
        self.status = secs;
        secs = secs - 1;
        timerRunning = true;
        timerID = self.setTimeout("StartTheTimer()", delay);
    }
}

function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function IsNumeric(sText)
{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;

 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
}


//<script>
//////////////////
// Helper Stuff //
//////////////////

// used to find the Automation server name
function getDomDocumentPrefix() {
	if (getDomDocumentPrefix.prefix)
		return getDomDocumentPrefix.prefix;

	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".DomDocument");
			return getDomDocumentPrefix.prefix = prefixes[i];
		}
		catch (ex) {};
	}

	throw new Error("Could not find an installed XML parser");
}

function getXmlHttpPrefix() {
	if (getXmlHttpPrefix.prefix)
		return getXmlHttpPrefix.prefix;

	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var o;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			o = new ActiveXObject(prefixes[i] + ".XmlHttp");
			return getXmlHttpPrefix.prefix = prefixes[i];
		}
		catch (ex) {};
	}

	throw new Error("Could not find an installed XML parser");
}

//////////////////////////
// Start the Real stuff //
//////////////////////////



// XmlHttp factory
function XmlHttp() {}

XmlHttp.create = function () {
    //console.log(window.XMLHttpRequest);
	try {

	    console.log("inside try");

		if (window.XMLHttpRequest) {
		    console.log("inside if");
			var req = new XMLHttpRequest();

			// some versions of Moz do not support the readyState property
			// and the onreadystate event so we patch it!
			if (req.readyState == null) {
				req.readyState = 1;
				req.addEventListener("load", function () {
					req.readyState = 4;
					if (typeof req.onreadystatechange == "function")
						req.onreadystatechange();
				}, false);
			}

			return req;
		}
		if (window.ActiveXObject) {
			return new ActiveXObject(getXmlHttpPrefix() + ".XmlHttp");
		}
	}
	catch (ex) {}
	// fell through
	throw new Error("Your browser does not support XmlHttp objects");
};

// XmlDocument factory
function XmlDocument() {}

XmlDocument.create = function () {
	try {
		// DOM2
		if (document.implementation && document.implementation.createDocument) {
			var doc = document.implementation.createDocument("", "", null);

			// some versions of Moz do not support the readyState property
			// and the onreadystate event so we patch it!
			if (doc.readyState == null) {
				doc.readyState = 1;
				doc.addEventListener("load", function () {
					doc.readyState = 4;
					if (typeof doc.onreadystatechange == "function")
						doc.onreadystatechange();
				}, false);
			}

			return doc;
		}
		if (window.ActiveXObject)
			return new ActiveXObject(getDomDocumentPrefix() + ".DomDocument");
	}
	catch (ex) {}
	throw new Error("Your browser does not support XmlDocument objects");
};

// Create the loadXML method and xml getter for Mozilla
// if (window.DOMParser &&
// 	window.XMLSerializer &&
// 	window.Node && Node.prototype && Node.prototype.__defineGetter__) {
//
// 	// XMLDocument did not extend the Document interface in some versions
// 	// of Mozilla. Extend both!
// 	XMLDocument.prototype.loadXML =
// 	Document.prototype.loadXML = function (s) {
//
// 		// parse the string to a new doc
// 		var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
//
// 		// remove all initial children
// 		while (this.hasChildNodes())
// 			this.removeChild(this.lastChild);
//
// 		// insert and import nodes
// 		for (var i = 0; i < doc2.childNodes.length; i++) {
// 			this.appendChild(this.importNode(doc2.childNodes[i], true));
// 		}
// 	};
//
//
// 	/*
// 	 * xml getter
// 	 *
// 	 * This serializes the DOM tree to an XML String
// 	 *
// 	 * Usage: var sXml = oNode.xml
// 	 *
// 	 */
// 	// XMLDocument did not extend the Document interface in some versions
// 	// of Mozilla. Extend both!
// 	XMLDocument.prototype.__defineGetter__("xml", function () {
// 		return (new XMLSerializer()).serializeToString(this);
// 	});
// 	Document.prototype.__defineGetter__("xml", function () {
// 		return (new XMLSerializer()).serializeToString(this);
// 	});
// }
//
//

function jsrsaenc(key,mod,keylen,pass)
{

var ekey = key;
var modulus = mod;
var rsakeylength =keylen;
SCnumbersize = rsakeylength/16;

if(trim(pass,"") != "")
{
var message = intonum(pass);	
var e = hexnum(ekey);
var m = hexnum(modulus);
var ans="";
ModInverse = modulusinverse(hexnum(modulus),SCnumbersize);
  ans = tohex1(modpowwithinverse(message,e,m,ModInverse,SCnumbersize),SCnumbersize);
  //console.log("the ans is "+ans);
  return ans;
//document.getElementById('data').value = tohex1(modpow(message,e,m,SCnumbersize),SCnumbersize);
} 

 
}


var tmpTest = false;
var a = 0;
function loadKey(pass)
{
    if(tmpTest)
    {
    console.log('yyyyyyyyyyyyyyyyyy');
    //alert('yyyyyyyyyyyyyyyyyy');
    return;
    }
    
    tmpTest = true;
    if( a != 0)
        return;
    a = 1;
   
  var i=0;
  try
  {
    var xmlHttp = XmlHttp.create(); 
    var datetime=new Date();
    console.log(datetime);
     var key = ""; 
     var modulus = "";
     var keylen = "", data;
          
    xmlHttp.open("GET", 'http://biis.buet.ac.bd/BIIS_WEB/keyGeneration.do?date='+datetime, true);
    
   
    
    xmlHttp.onreadystatechange = function ()
    { 
      if (xmlHttp.readyState == 4)
      {
        if (xmlHttp.status==200)
        {
          key = xmlHttp.responseXML.getElementsByTagName("key")[0].childNodes[0].nodeValue;
          modulus = xmlHttp.responseXML.getElementsByTagName("modulus")[0].childNodes[0].nodeValue;
          keylen = xmlHttp.responseXML.getElementsByTagName("keylen")[0].childNodes[0].nodeValue;
          ans = jsrsaenc(key,modulus,keylen,pass);
          a == 0;
          console.log(ans);
          return ans;
          
        }
      }
    }
     
    window.setTimeout(function ()
    {
      xmlHttp.send(null);
    }, 10);
  }
  catch(e){
      console.log(e);
      return e;}
  
  tmpTest = false;
 }

 //loadKey("apple");