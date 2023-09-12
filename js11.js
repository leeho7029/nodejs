var test1 = [10,15,20,30,40,50];
//console.log(test1.map(function(c) { return c<=20 }));
//console.log(test1.map(c => c<=20));
//console.log(test1.map(c => { if(c<=20) return c; }));
console.log(test1.filter(c => { if(c<=20) return c; }));
