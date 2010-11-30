/*** Spatial HashMap for broad phase collision** @author Louis Stowasser*/(function(parent) {var HashMap = function(cell) {		HashMap.cellsize = cell || 64;		this.map = {};		this.GUID = 0;	},	M = Math,	Mathfloor = M.floor;HashMap.prototype = {	insert: function(obj) {		var keys = HashMap.key(obj),			entry = new Entry(keys,obj,this),			i = 0,			j,			hash;					//insert into all x buckets		for(i=keys.x1;i<=keys.x2;i++) {			//insert into all y buckets			for(j=keys.y1;j<=keys.y2;j++) {				hash =  i + " " + j;				if(!this.map[hash]) this.map[hash] = [];				this.map[hash].push(obj);			}		}				return entry;	},		search: function(rect) {		var keys = HashMap.key(rect),			i,j,			hash,			obj,			id,			results = [],			finalresult = [],			found = {};							//search in all x buckets		for(i=keys.x1;i<=keys.x2;i++) {			//insert into all y buckets			for(j=keys.y1;j<=keys.y2;j++) {				hash =  i + " " + j;								if(this.map[hash]) {					results = results.concat(this.map[hash]);				}			}		}				//add unique elements to lookup table with the entity ID as unique key		for(i=0,l=results.length;i<l;i++) {			obj = results[i];			if(!obj) continue; //skip if deleted			id = obj[0]; //unique ID						//check if not added to hash and that actually intersects			if(!found[id] && obj.x < rect.x + rect.w && obj.x + obj.w > rect.x &&							 obj.y < rect.y + rect.h && obj.h + obj.y > rect.y) 			   found[id] = results[i];		}				//loop over lookup table and copy to final array		for(obj in found) finalresult.push(found[obj]);				return finalresult;	},		remove: function(keys,obj) {		var i = 0, j;					if(arguments.length == 1) {			obj = keys;			keys = HashMap.key(obj);		}					//search in all x buckets		for(i=keys.x1;i<=keys.x2;i++) {			//insert into all y buckets			for(j=keys.y1;j<=keys.y2;j++) {				hash = i + " " + j;								if(this.map[hash]) {					var cell = this.map[hash], m = 0, n = cell.length;					//loop over objs in cell and delete					for(;m<n;m++) if(cell[m] && cell[m][0] === obj[0]) 						cell.splice(m,1);				}			}		}	}};HashMap.key = function(obj) {	var x1 = Mathfloor(obj.x / HashMap.cellsize),		y1 = Mathfloor(obj.y / HashMap.cellsize),		x2 = Mathfloor((obj.w + obj.x) / HashMap.cellsize),		y2 = Mathfloor((obj.h + obj.y) / HashMap.cellsize);	return {x1: x1, y1: y1, x2: x2, y2: y2};};HashMap.hash = function(keys) {	return keys.x1 + " " + keys.y1 + " " + keys.x2 + " " + keys.y2;};function Entry(keys,obj,map) {	this.keys = keys;	this.map = map;	this.obj = obj;}Entry.prototype = {	update: function(rect) {		//check if buckets change		if(HashMap.hash(HashMap.key(rect)) != HashMap.hash(this.keys)) {			//console.log(this.keys, this.obj);			this.map.remove(this.keys, this.obj);			var e = this.map.insert(this.obj);			this.keys = e.keys;		}	}};parent.HashMap = HashMap;})(Crafty);