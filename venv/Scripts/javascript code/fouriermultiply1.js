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

