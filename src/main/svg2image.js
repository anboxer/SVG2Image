(function(factor){
	window.svg2image=factor();
})(function(){
	'use strict';
	
	function macthCSS(origin, target){
		var oChildren=origin.childNodes,
			leng=oChildren.length, 
			tChildren=target.childNodes, 
			oItem,tItem, ComputedStyle,
			notMacthCSS={
				title: true,
				g:true
			},
			except={
				defs:true,
				metadata: true,
				use:true,
				style: true,
				script: true,
				filter: true,
				animate: true, 
				animateColor: true, 
				animateMotion: true, 
				animateTransform: true, 
				set: true,
				linearGradient: true, 
				radialGradient: true
			};
			
		ComputedStyle=getComputedStyle(origin);
		if(ComputedStyle&&!notMacthCSS[origin.tagName]){
			target.setAttribute('style', ComputedStyle.cssText);
		}
		
		for (var i=0; i<leng; i++) {
			oItem = oChildren.item(i);
			tItem = tChildren.item(i);
			if(!except[oItem.tagName]){
				macthCSS(oItem, tItem);
			}
		}
	}
	
	function cloneSVG(el){
		var ns = "http://www.w3.org/2000/svg";
		var svg=document.createElementNS(ns, 'svg');
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink",
                       "http://www.w3.org/1999/xlink");
		svg.innerHTML=el.innerHTML;
		
		return svg;
	}
	function caculatePosition(bbox, clienRect, canvasSize){
		var p={
				x:0,
				y:0
			},
			bw=bbox.width,
			bh=bbox.height,
			cw=canvasSize.w,
			ch=canvasSize.h,
			rw=clienRect.width,
			rh=clienRect.height;
		
		p.x=((cw-bw*cw/rw)/2-bbox.x*cw/rw);
		p.y=((ch-bh*ch/rh)/2-bbox.y*ch/rh);
		
		return p;
	}
	
	function getDrawSize(bbox, canvasSize, clienRect){
		var iw=bbox.width,
			ih=bbox.height,
			cw=canvasSize.w,
			ch=canvasSize.h,
			s={
				w:iw,
				h:ih
			},
			t={w:0, h:0},
			sw=cw/iw,
			sh=ch/ih,
			scale=1;
		
		scale= Math.min(sh, sw);
		
		s.w=scale*clienRect.width;
		s.h=scale*clienRect.height;
		s.x=(cw-iw*scale)/2-scale*bbox.x;
		s.y=(ch-ih*scale)/2-scale*bbox.y;
		
		return s;	
	}
	
	var svg2image=function(option){
		var bbox=option.src.getBBox(),
			clienRect=option.src.getBoundingClientRect(),
			width=bbox.width,
			height=bbox.height,
			leng=Math.max(width, height),
			exW=option.width||leng,
			exH=option.height||leng,
			svg=cloneSVG(option.src);
		
		macthCSS(option.src, svg);
		
		var svgData=new XMLSerializer().serializeToString( svg );
		var canvas = document.createElement( "canvas" );
		
		canvas.width=exW;
		canvas.height=exH;
		
    	var ctx = canvas.getContext( "2d" );
    	
    	var dataUri = '';
    	
    	try{
    		dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    	}catch (ex) {
    		console.log(ex);
    	}
    	
    	var img = document.createElement( "img" );
		img.width=clienRect.width;
    	img.height=clienRect.height;
    	
    	var pdiv=document.createElement( "div" );
    	pdiv.style.opacity=0;
    	pdiv.style.width=0;
    	pdiv.style.height=0;
    	
    	pdiv.appendChild(img);
	    document.querySelector("body").appendChild(pdiv);
    	
    	img.onload = function() {
    		var x=0, y= 0,
    			s=getDrawSize(bbox, {w:exW, h:exH}, clienRect);
        	
        	ctx.drawImage(img, s.x, s.y, s.w, s.h);
 
	        try {
	            var a = document.createElement("a");
	            var fileNmae=option.dest;
	            if(!fileNmae){
	            	fileNmae=(new Date()).toISOString();
	            }
	            a.download = fileNmae+".png";
	            a.href = canvas.toDataURL("image/png");
	            document.querySelector("body").appendChild(a);
	           	a.click();
	            document.querySelector("body").removeChild(a);
	            setTimeout(function(){document.querySelector("body").removeChild(pdiv);}, 1500);
	        } catch (ex) {
	            console.log(ex);
	        }
	    };
	 
	    img.src = dataUri;
	};
	
	return svg2image;
});
