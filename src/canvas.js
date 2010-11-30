/*** Canvas Components and Extensions*/Crafty.c("canvas", {		init: function() {		//add the object to the RTree		//this.entry = tree.put(this);				//on change, redraw		this.bind("change", function(e) {			e = e || this;						//clear self			Crafty.context.clearRect(e.x, e.y, e.w, e.h);						//update position in RTree			var pos = this.pos();			//this.entry.update(pos.x,pos.y,pos.w,pos.h);						//add to the DrawBuffer			DrawBuffer.add(this,e);		});				this.bind("remove", function() {			//this.trigger("change");			Crafty.context.clearRect(this.x, this.y, this.w, this.h);			DrawBuffer.remove(this);		});	},		draw: function(x,y,w,h) {				var co = {},			coord = this.__coord || this.pos(),			pos = this.pos();				//if offset		co.x = coord[0];		if(x !== undefined && typeof x === "number") {			co.x = coord[0] + x;			pos.x += x;		}		co.y = coord[1];		if(y !== undefined && typeof y === "number") {			co.y = coord[1] + y;			pos.y += y;		}		co.w = coord[2];		if(w !== undefined) {			co.w = w;			pos.w = w;		}		co.h = coord[3];		if(h !== undefined) {			co.h = h;			pos.h = h;		}				if(this.has("sprite")) {			//don't draw if not loaded			if(!this.img.width) return;						try {				//draw the image on the canvas element				Crafty.context.drawImage(this.img, //image element										 co.x, //x position on sprite										 co.y, //y position on sprite										 co.w, //width on sprite										 co.h, //height on sprite										 pos.x, //x position on canvas										 pos.y, //y position on canvas										 pos.w, //width on canvas										 pos.h //height on canvas				);			} catch(err) {				console.log(co,pos,err,x,y,w,h);			}		} else if(this.has("color")) {			Crafty.context.fillStyle = this.color;			//if(this.has("bottom")) console.log(pos.x,pos.y,pos.w,pos.h);			Crafty.context.fillRect(pos.x,pos.y,pos.w,pos.h);		} else if(this.has("image")) {			if(!this.img) return;			var i = 0, l, j = 0, k;			switch(this._repeat) {				case "repeat-x":					if(this.img.width === 0) return;					for(l = Math.floor(this.w / this.img.width); i < l; i++) {						Crafty.context.drawImage(this.img, this.x + this.img.width * i, this.y);					}					break;				case "repeat-y":					if(this.img.height === 0) return;					for(l = Math.floor(this.h / this.img.height); i <= l; i++) {						Crafty.context.drawImage(this.img, this.x, this.y + this.img.height * i);					}					break;				default:					if(this.img.width === 0 || this.img.height === 0) return;					for(l = Math.floor(this.w / this.img.width); i < l; i++) {						Crafty.context.drawImage(this.img, this.x + this.img.width * i, this.y);						for(j = 0, k = Math.floor(this.h / this.img.height); j <= k; j++) {							Crafty.context.drawImage(this.img, this.x + this.img.width * i, this.y + this.img.height * j);						}					}										break;			}		}	}});Crafty.extend({	context: null,		/**	* Set the canvas element and 2D context	*/	canvas: function(elem) {		if(!('getContext' in elem)) return;		this.context = elem.getContext('2d');	},});