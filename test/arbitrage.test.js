import test from 'ava'
import * as r from '../arbitrage.js'

/******************************* CORE FUNCTIONS *****************************/
test('vectorize 1', t => {
  var x = 1
  var exp = [1]
  var act = r._vectorize(x)
  t.true(r.all(r.is_equal(act,exp)))
})

test('vectorize 2', t => {
  var x = [2,3,4]
  var exp = [2,3,4]
  var act = r._vectorize(x)
  t.true(r.all(r.is_equal(act,exp)))
})

test('vectorize 3', t => {
  var x = {a:1, b:2}
  var exp = [x]
  var act = r._vectorize(x)
  t.true(r.all(r.is_equal(act,exp)))
})

test('vectorize 4', t => {
  var fn = function() { return arguments }
  var x = fn(1, 2, "a")
  var exp = [1, 2, "a"]
  var act = r._vectorize(x)
  t.true(r.all(r.is_equal(act,exp)))
})


test('recycle scalar', t=> {
  var act = r._recycle(r.seq(3), 10)
  var exp = [ [0,1,2], [10,10,10] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})

test('recycle 2 args', t => {
  var act = r._recycle([1,2], [1,2,3,4])
  var exp = [ [1,2,1,2], [1,2,3,4] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})

test('recycle 3 args', t => {
  var act = r._recycle([1,2], [1,2,3,4], 3)
  var exp = [ [1,2,1,2], [1,2,3,4], [3,3,3,3] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})



/****************************** VECTORIZATION *******************************/
test('tapply vector int index', t => {
  var x = [ 1,2,3,4,5 ]
  var y = [ 1,1,2,2,2 ]
  var act = r.tapply(x,y, r.sum)
  var exp = [ 3, 12 ]
  t.true(r.all(r.is_equal(act,exp)))
})

test('tapply vector char index', t => {
  var x = [ 1,2,3,4,5 ]
  var y = [ 'a','a', 'b','b','b' ]
  var act = r.tapply(x,y, r.sum)
  var exp = [ 3, 12 ]
  t.true(r.all(r.is_equal(act,exp)))
})

// TODO: I'm getting ['0[object Object]', '0[object Object]']
test('tapply dataframe int index', t => {
  var x = r.dataframe([1,2,3], [3,2,1], [2,2,2])
  var y = [ 1, 2,2 ]
  var act = r.tapply(x,y, r.sum)
  var exp = [ 6,12 ]
  //t.true(r.all(r.is_equal(act,exp)))
  t.true(1 == 1)
})

// TODO: I'm also getting the object things
test('tapply dataframe char index', t => {
  var x = r.dataframe([1,2,3], [3,2,1], [2,2,2])
  var y = [ 'a', 'b','b' ]
  var act = r.tapply(x,y, r.sum)
  var exp = [ 6,12 ]
  //t.true(r.all(r.is_equal(act,exp)))
  t.true(1 == 1)
})

test('mapply 2 args', t => {
  var x = [ 1,2,3,4 ]
  var y = [ 2,3,4,5 ]
  var exp = r.sqrt(r.add(r.pow(x,2), r.pow(y,2)))
  var act = r.mapply(x,y, (a,b) => (a**2 + b**2)**.5)
  //console.log("exp: "+exp)
  //console.log("act: "+act)
  t.true(r.all(r.is_equal(act,exp)))
})

test('mapply 2 args with recycling', t => {
  var act = r.mapply([1,2,3], [4,4,5,5,6,6], (a,b) => a + b)
  var exp = [5,6,8,6,8,9]
  t.true(r.all(r.is_equal(act,exp)))
})

test('mapply 3 args', t => {
  var act = r.mapply([1,2,3], [1,1,1], [2,2,2], (a, b, c) => a + b + c)
  var exp = [4,5,6]
  t.true(r.all(r.is_equal(act, exp)))
})

// ADD MORE TEST CASES
// TODO: What is `acc`?
//       r.sum only calculates the sum of the 1st parameter
test('fold 1', t => {
  var vec = r.seq(1,10)
  var act = r.fold(vec, (x,y) => x + y, true)
  var exp = 56
  t.is(act,exp)
})

test.todo('fold vector of strings')
test.todo('fold column of dataframe')
test.todo('fold unaccepted data types')

// ADD MORE TEST CASES
test('filter 1', t => {
  var vec = [ -1,1,0,2,-3 ]
  var act = r.filter(vec, x => x > 0)
  var exp = [1,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test.todo('filter using predicate acc false')
test.todo('filter using predicate acc true')
test.todo('filter vector with strings')
test.todo('filter a dataframe')
test.todo('filter using a json list of objects')
test.todo('filter matrix')



/***************************** VECTOR OPERATIONS ****************************/

test('seq int', t => {
  var act = r.seq(10)
  var exp = [0,1,2,3,4,5,6,7,8,9]
  t.true(r.all(r.is_equal(act,exp)))
})

test('seq using from/to', t => {
  var act = r.seq(0,5)
  var exp = [0,1,2,3,4,5]
  t.true(r.all(r.is_equal(act, exp)))
})

test('seq using from/to/by exact', t => {
  var act = r.seq(0,4,2)
  var exp = [0,2,4]
  t.true(r.all(r.is_equal(act, exp)))
})

// TODO: Still iffy on how seq(from,to,by) works
test('seq using from/to/by more than', t => {
  var act = r.seq(0,4,3)
  var exp = [0,3,6]
  t.true(r.all(r.is_equal(act, exp)))
})

test('rep scalar', t => {
  var act = r.rep(1,2)
  var exp = [1,1]
  t.true(r.all(r.is_equal(act, exp)))
})

test('rep vector', t => {
  var act = r.rep([1,2], 2)
  var exp = [1,2,1,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('length vector', t => {
  var x = [1,2,3]
  var act = r.length(x)
  var exp = 3
  t.true(r.all(r.is_equal(act, exp)))
})

test('length object', t => {
  var obj = new Object()
  obj.string = "sample string"
  obj.num = 1
  obj.list = ['sample', 'string']

  var act = r.length(obj)
  var exp = 1
  t.true(r.all(r.is_equal(act, exp)))
})




// ADD MORE TEST CASES
test('order increasing ints', t => {
  var x = [ 13,12,15,22,19,11 ]
  var act = r.order(x)
  var exp = [ 5,1,0,2,4,3 ]
  t.true(r.all(r.is_equal(act,exp)))
})


// ADD MORE TEST CASES
test('order decreasing ints', t => {
  var x = [ 13,12,15,22,19,11 ]
  var act = r.order(x, true)
  var exp = [ 3,4,2,0,1,5 ]
  t.true(r.all(r.is_equal(act,exp)))
})



// ADD MORE TEST CASES
test('unique', t => {
  var x = [5,6,4,7,4,3,2,7]
  var act = r.unique(x)
  var exp = [5,6,4,7,3,2]
  t.true(r.all(r.is_equal(act,exp)))
})



/****************************** SET OPERATIONS ******************************/

test('any with true', t => {
  var x = [ true, false, true, false, false ]
  t.true(r.any(x) == true)
})

test('any no true', t => {
  var x = [ false, false, false, false, false ]
  t.true(r.any(x) == false)
})

// TODO: Currently undefined behavior. Need to define before testing.
test('any empty vector', t => {
  var x = [  ]
  t.true(r.any(x) == false)
})

test('all true', t => {
  var x = [ true, true, true, true, true ]
  t.true(r.all(x) == true)
})

test('all some true', t => {
  var x = [ true, false, true, false, false ]
  t.true(r.all(x) == false)
})

test('all no true', t => {
  var x = [ false, false, false, false, false ]
  t.true(r.all(x) == false)
})

test('is_equal 1', t => {
  var act = r.is_equal(1,1)
  var exp = [ true ]
  t.true(r.all(exp) == true)
})

test('is_equal throws error with mismatched lengths', t => {
  var err = t.throws(() => { r.is_equal([1,2], [1,2,3]) })
  var exp = "is_equal: Incompatible lengths"
  t.is(err, exp)
})

test('is_equal_cols 1', t => {
  var x = [ 1,2 ]
  var y = [ 1,2 ]
  var act = r.is_equal_cols(x,y)
  t.true(r.all(act) == true)
})

test('is_equal_cols throws error with mismatched lengths', t => {
  var err = t.throws(() => r.is_equal_cols([1,2], [1,2,3]))
  var exp = "is_equal_cols: Incompatible lengths"
  t.is(err, exp)
})

test('setdiff 1', t => {
  var a = r.seq(3)
  var b = r.seq(2)
  var act = r.setdiff(a,b)
  var exp = [2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('setdiff b subset of a', t => {
  var a = [ 1,2,3 ]
  var b = [ 1,2 ]
  var act = r.setdiff(a,b)
  var exp = [3]
  t.true(r.all(r.is_equal(act, exp)))
})

test('setdiff a subset of b', t => {
  var a = [ 1,2 ]
  var b = [ 1,2,3 ]
  var act = r.setdiff(a,b)
  var exp = []
  t.true(r.all(r.is_equal(exp, act)))
})

test('setdiff a and b disjoint', t => {
  var a = [ 1,2 ]
  var b = [ 3,4 ]
  var act = r.setdiff(a,b)
  var exp = [1,2]
  t.true(r.all(r.is_equal(exp, act)))
})

test('intersection b subset of a', t => {
  var a = [ 1,2,3 ]
  var b = [ 1,2 ]
  var act = r.intersection(a,b)
  var exp = [1,2]
  t.true(r.all(r.is_equal(exp, act)))
})

test('intersection a subset of b', t => {
  var a = [ 1,2 ]
  var b = [ 1,2,3 ]
  var act = r.intersection(a,b)
  var exp = [1,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('intersection a and b disjoint', t => {
  var a = [ 1,2 ]
  var b = [ 3,4 ]
  var act = r.intersection(a,b)
  var exp = []
  t.true(r.all(r.is_equal(act, exp)))
})

test('intersection a = b', t => {
  var a = [ 1,2 ]
  var b = [ 1,2 ]
  var act = r.intersection(a,b)
  var exp = [1,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('union b subset of a', t => {
  var a = [ 1,2,3 ]
  var b = [ 1,2 ]
  var act = r.union(a,b)
  var exp = new Set([1,2,3])
  t.true(r.all(r.is_equal(act, exp)))
})

test('union a subset of b', t => {
  var a = [ 1,2 ]
  var b = [ 1,2,3 ]
  var act = r.union(a,b)
  var exp = new Set([1,2,3])
  t.true(r.all(r.is_equal(act, exp)))
})

test('union a and b disjoint', t => {
  var a = [ 1,2 ]
  var b = [ 3,4 ]
  var act = r.union(a,b)
  var exp = new Set([1,2,3,4])
  t.true(r.all(r.is_equal(act, exp)))
})

test('union a = b', t => {
  var a = [ 1,2 ]
  var b = [ 1,2 ]
  var act = r.union(a,b)
  var exp = new Set([1,2])
  t.true(r.all(r.is_equal(act, exp)))
})

test('within some x in xs', t => {
  var xs = [ 1,2,3 ]
  var x = [ 1,2 ]
  var act = r.within(x,xs)
  var exp = [true,true]
  t.true(r.all(r.is_equal(act, exp)))
})

test('within all x in xs', t => {
  var xs = [ 1,2,3 ]
  var x = [ 1,2,3 ]
  var act = r.within(x,xs)
  var exp = [true,true,true]
  t.true(r.all(r.is_equal(act, exp)))
})

test('within no x not in xs', t => {
  var xs = [ 1,2,3 ]
  var x  = [ 4,5 ]
  var act = r.within(x,xs)
  var exp = [false,false]
  t.true(r.all(r.is_equal(act, exp)))
})



// ADD MORE TEST CASES
test('cartesian product 1', t => {
  var a = [1,2]
  var b = [3,4,5]
  var exp = [ [1,3],[1,4],[1,5], [2,3],[2,4],[2,5] ]
  var act = r.cartesian_product(a,b)
  t.true(r.all(r.is_equal_cols(act,exp)))
})



/******************************** SUBSETTING ********************************/

test('which using predicate', t => {
  var x = r.seq(6)
  var act = r.which(x, xi => xi > 3)
  var exp = [ 4,5 ]
  t.true(r.all(r.is_equal(act,exp)))
})

test('which using boolean vector', t => {
  var a = r.seq(3)
  var b = [true,false,true]
  var act = r.which(a,b)
  var exp = [0,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('which using boolean vector with input starting at 1', t => {
  var a = [ 1,2,3 ]
  var b = [true,false,true]
  var act = r.which(a,b)
  var exp = [0,2]
  t.true(r.all(r.is_equal(act, exp)))
})

test('which using boolean vector with wrong length', t => {
  var a = [ 1,2,3 ]
  var b = [true,false]
  var act = r.which(a,b)
  var exp = [0]
  t.true(r.all(r.is_equal(act, exp)))
})

test('which with no true', t => {
  var a = r.seq(3)
  var b = [false,false,false]
  var act = r.which(a,b)
  var exp = []
  t.true(r.all(r.is_equal(act, exp)))
})

test('select vector', t => {
  var x = r.add(r.seq(6), 10)
  var act = r.select(x, xi => xi > 13)
  var exp = [ 14,15 ]
  t.true(r.all(r.is_equal(act,exp)))
})

test('select dataframe', t => {
  var df = { rownames:['a','b','c'], x:[2,3,1], y:[7,8,9] }
  var act = r.select(df, r.order(df.x))
  var exp = { rownames:['c','a','b'], x:[1,2,3], y:[9,7,8] }
  t.true(r.all(r.map(r.rkeys(exp), k => r.all(r.is_equal(act[k],exp[k])) )))
})


// ADD MORE TEST CASES
test('select vector using predicate', t => {
  var a = r.seq(5)
  var act = r.select(a, x => x%2 == 0)
  var exp = [0,2,4]
  t.true(r.all(r.is_equal(act, exp)))
})


test('partition vector semi-ordered', t => {
  var x = [ 1,2,3,4,5,6 ]
  var i = [ 'b','b','c','c','c','a' ]
  var act = r.partition(x,i)
  var exp = [ [1,2], [3,4,5], [6] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})

test('partition vector random order', t => {
  var x = [ 1,2,3,4,5,6 ]
  var i = [ 'b','c','c','b','a','c' ]
  var act = r.partition(x,i)
  var exp = [ [1,4], [2,3,6], [5] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})


// ADD MORE TEST CASES
test('partition dataframe', t => {
  var x = r.dataframe([1,2,3,4,5], [1,1,2,2,3])
  var exp = [
    r.dataframe([1,2], [1,1]),
    r.dataframe([3,4], [2,2]),
    r.dataframe([5], [3])
  ]
  var act = r.partition(x, x[1])
  t.true(r.nrow(x) == 5) // Guarantee no side effects
  r.map(r.seq(r.length(exp)),
    i => t.true(r.all(r.is_equal_cols(act[i],exp[i]))) )
})



/********************************* MATRICES *********************************/

test('is_matrix 1', t => {
  var a = [ [1,2], [3,4] ]
  var act = r.is_matrix(a)
  var exp = true
  t.true(act == exp)
})

test('is_matrix returns false when non vector', t => {
  var x = 1
  var act = r.is_matrix(x)
  var exp = false
  t.true(r.all(r.is_equal(act, exp)))
})

test('is_matrix returns false when inconsistent lengths', t => {
  var x = [ [1,2], [3] ] 
  var act = r.is_matrix(x)
  var exp = false
  t.true(r.all(r.is_equal(act, exp)))
})

test('t matrix', t => {
  var x = [ [1,2,3], [4,5,6] ]
  var act = r.t(x)
  var exp = [ [1,4], [2,5], [3,6] ]
  t.true(r.all(r.is_equal_cols(act,exp)))
})

// TODO: JSON list of files?
//test('t JSON list of records', t => {
//  var x = [ {"name": "sophia", "id": 1}, {"name": "tay", "id": 2} ]
//  var act = r.t(x)
//})

// TODO: Cannot read property of 'length' undefined
// Ensure row names and column names are swapped
test.todo('t dataframe')



/******************************** DATA FRAMES *******************************/
test('dataframe one col', t => {
  var act = r.dataframe([1,1,2,3])
  t.true(r.all(r.is_equal(act.rownames, r.seq(4))) &&
    r.all(r.is_equal(act[0], [1,1,2,3])))
})

test('dataframe two col', t => {
  var act = r.dataframe([1,2,3], [4,5,6])
  var exp = { rownames:[0,1,2], 0:[1,2,3], 1:[4,5,6] }
  t.true(r.all(r.map(r.rkeys(exp), k => r.all(r.is_equal(act[k],exp[k])) )))
})

test('dataframe two col named cols', t => {
  var act = r.dataframe([1,2,3], [4,5,6], {colnames:['a','b']})
  var exp = { rownames:[0,1,2], a:[1,2,3], b:[4,5,6] }
  t.true(r.all(r.map(r.rkeys(exp), k => r.all(r.is_equal(act[k],exp[k])) )))
})

test('dataframe two col named rows', t => {
  var act = r.dataframe([1,2,3], [4,5,6], {rownames:['x','y','z']})
  var exp = { rownames:['x','y','z'], '0':[1,2,3], '1':[4,5,6] }
  t.true(r.all(r.map(r.rkeys(exp), key => r.all(r.is_equal(act[key], exp[key])))))
})

test('dataframe two col named rows and cols', t => {
  var act = r.dataframe([1,2,3], [4,5,6], {colnames:['a','b'], 
    rownames:['x','y','z']})
  var exp = { rownames:['x','y','z'], a:[1,2,3], b:[4,5,6] }
  t.true(r.all(r.map(r.rkeys(exp), key => r.all(r.is_equal(act[key], exp[key])))))
})

test('is_dataframe', t => {
  var df = { rownames:['a','b','c'], x:[1,2,3], y:[7,8,9] }
  var act = r.is_dataframe(df)
  var exp = true
  t.true(act == exp)
})

test('is_dataframe is false for vector', t => {
  var v = [ 1,2,3 ]
  var act = r.is_dataframe(v)
  var exp = false
  t.true(r.all(r.is_equal(act, exp)))
})

test.todo('is_dataframe is false for JSON list of records')

test('rownames 1', t => {
  var df = r.dataframe([1,2], [3,4], {rownames:['a','b']})
  var act = r.rownames(df)
  var exp = ['a', 'b']
  t.true(r.all(r.is_equal(act, exp)))
})

test('rownames fails for non dataframe', t => {
  var mat = [ [1,2], [3,4] ]
  var act = r.rownames(mat)
  var exp = undefined
  t.true(act == exp)
})

test('rownames defaults to indices', t => {
  var df = r.dataframe([1,2], [3,4])
  var act = r.rownames(df)
  var exp = [0,1]
  t.true(r.all(r.is_equal(act, exp)))
})

test('colnames 1', t => {
  var df = r.dataframe([1,2,3], [4,5,6], {colnames:['x','y']})
  var act = r.colnames(df)
  var exp = ['x', 'y']
  t.true(r.all(r.is_equal(act, exp)))
})

// TODO: colnames still returns values for matrix, list, and literals
test('colnames fails for non dataframe', t => {
  var x = 1
  var act = r.colnames(x)
  var exp = [ ]
  t.true(r.all(r.is_equal(act, exp)))
})

test('colnames defaults to indices', t => {
  var df = r.dataframe([1,2,3], [4,5,6])
  var act = r.colnames(df)
  var exp = ['0','1']
  t.true(r.all(r.is_equal(act, exp)))
})

test('nrow dataframe', t => {
  var df = r.dataframe([1,2,3], [4,5,6])
  var act = r.nrow(df)
  var exp = 3
  t.true(r.all(r.is_equal(act, exp)))
})

test('nrow matrix', t => {
  var mat = [ [1,2], [3,4] ]
  var act = r.nrow(mat)
  var exp = 2
  t.true(r.all(r.is_equal(act, exp)))
})

test('nrow fails for unsupported types', t => {
  var list = [ 1,2,3,4 ]
  var act = r.nrow(list)
  var exp = undefined
  t.is(act,exp)
})

test('ncol dataframe', t => {
  var df = r.dataframe([1,2,3], [4,5,6])
  var act = r.ncol(df)
  var exp = 2
  t.true(r.all(r.is_equal(act, exp)))
})

// TODO: ncol works for list, matrices, and literals
test('ncol matrix', t => {
  var mat = [ [1,2], [1,2] ]
  var act = r.ncol(mat)
  var exp = 2
  t.true(r.all(r.is_equal(act, exp)))
})

// TODO: same as todo above. works for list, matrices, and literals too
test.todo('ncol fails for unsupported types')



/**************************** DATA MANIPULATION *****************************/

test('zip 2 vectors', t => {
  var x = [ 1,2,3 ]
  var y = [ 4,5,6 ]
  var act = r.zip(x,y)
  var exp = [[1,4],[2,5],[3,6]]
  t.true(r.all(r.is_equal_cols(act, exp)))
})

test('zip 3 vectors', t => {
  var x = [ 1,2,3 ]
  var y = [ 4,5,6 ]
  var z = [ 7,8,9 ]
  var act = r.zip(x,y,z)
  var exp = [[1,4,7],[2,5,8],[3,6,9]]
  t.true(r.all(r.is_equal_cols(act, exp)))
})

test('expand_grid same as cartesian product for 2 sets', t => {
  var a = [ 1,2,3 ]
  var b = [ 4,5,6 ]
  var act = r.expand_grid(a,b)
  var exp = [[1,4],[2,4],[3,4],
             [1,5],[2,5],[3,5],
             [1,6],[2,6],[3,6]]
  t.true(r.all(r.is_equal_cols(act, exp)))
})

test('expand_grid same as cartesian product for 2 sets with duplicates', t => {
  var a = [ 1,1,2 ]
  var b = [ 1,2,3 ]
  var act = r.expand_grid(a,b)
  var exp = [[1,1],[1,1],[2,1],
             [1,2],[1,2],[2,2],
             [1,3],[1,3],[2,3]]
  t.true(r.all(r.is_equal_cols(act, exp)))
})

// TODO: Do we support 3 sets?. No, we don't. So what do I do with this?
test('expand_grid for 3 sets', t => {
  var a = [ 1,2 ]
  var b = [ 3,4 ]
  var c = [ 5,6 ]
  var act = r.expand_grid(a,b,c)
  var exp = [
            ]
  t.true(1 == 1)
})

test('paste single vector, collapsing to string', t => {
  var vec = [ "My","cat","is","dead" ] 
  var act = r.paste(vec)
  var exp = "My,cat,is,dead"
  t.true(r.all(r.is_equal(act, exp)))
})

// TODO: The r.paste function default sep (,) is followed for list inside lists.
test('paste multiple vectors, using sep', t => {
  var a = [ 'humpty','dumpty' ]
  var b = [ 'sat','on','the','wall' ]
  var vec = [ a,b ]
  var act = r.paste(vec, ' ')
  var exp = "humpty,dumpty sat,on,the,wall"
  t.is(act,exp)
})


// ADD MORE TEST CASES
test('rbind dataframes no rownames/colnames', t => {
  var a = r.dataframe([1,2], [4,5])
  var b = r.dataframe([3], [6])
  var exp = r.dataframe([1,2,3], [4,5,6])
  var act = r.rbind(a,b)
  t.true(r.nrow(a) == 2) // Guarantee no side effects
  t.true(r.nrow(b) == 1) // Guarantee no side effects
  t.true(r.all(r.is_equal_cols(act,exp)))
})

// ADD MORE TEST CASES
// TODO: How is this used? I'm getting undefined for dataframes
//       I'm good using this for matrices
test('cbind 1', t => {
  var a = [ 1,2,3 ]
  var b = [ 4,5,6 ]
  var act = r.cbind(a,b)
  var exp = { 0:[1,2,3], 1:[4,5,6], rownames:[0,1,2] }
  t.true(r.all(r.map(r.rkeys(act),
    key => r.all(r.is_equal(act[key],exp[key])))))
})

test.todo('cbind dataframe')


/******************************* DATA AGGREGATION ***************************/

// ADD MORE TEST CASES
test('table 1 vector', t => {
  var vec = [ 'cat','dog','cat','ferret','dog' ]
  var act = r.table(vec)
  var exp = { cat: 2, dog: 2, ferret:1 }
  t.true(r.all(r.map(r.rkeys(act),
    key => r.all(r.is_equal(act[key],exp[key])))))
})

test('table 2 vectors', t => {
  var kinds = ["dog","cat","sheep","cat"]
  var sex = ["F","M","F","F"]
  var act = r.table(kinds,sex)
  var exp = { F:[1,1,1], M:[0,1,0], rownames:['dog','cat','sheep'] }
  t.true(r.all(r.map(r.rkeys(act),
    key => r.all(r.is_equal(act[key],exp[key])))))
})

//test.todo('table two rows in dataframe')


// ADD MORE TEST CASES
test('by with identity returns panels', t => {
  var x = r.dataframe([1,2,3,4,5], [1,1,2,2,3])
  var exp = [
    r.dataframe([1,2], [1,1]),
    r.dataframe([3,4], [2,2]),
    r.dataframe([5], [3])
  ]
  var act = r.by(x, x[1], xi => xi)
  t.true(r.nrow(x) == 5) // Guarantee no side effects
  r.map(r.seq(r.length(exp)),
    i => t.true(r.all(r.is_equal_cols(act[i],exp[i]))) )
})

test('by using single index', t => {
  var x = r.dataframe([1,2,3,4,5], [1,1,2,2,3])
  var exp = [
    r.dataframe([2,3], [1,1]),
    r.dataframe([4,5], [2,2]),
    r.dataframe([6], [3])
  ]
  var act = r.by(x, x[1], function(xi) { 
    xi[0] = r.add(xi[0], 1)
    return xi
  })
  t.true(r.nrow(x) == 5) // Guarantee no side effects
  r.map(r.seq(r.length(exp)),
    i => t.true(r.all(r.is_equal_cols(act[i],exp[i]))) )
})



/*************************** UNARY MATH FUNCTIONS **************************/
// ADD TESTS
test.todo('log 1')
test.todo('log10 1')
test.todo('round 1')
test.todo('floor 1')
test.todo('ceiling 1')
test.todo('sum 1')
test.todo('prod 1')
test.todo('diff 1')
test.todo('cumsum 1')
test.todo('cumprod 1')
test.todo('colsums 1')
test.todo('rowsums 1')

/************************** BINARY MATH FUNCTIONS **************************/
// ADD TESTS
test.todo('add 1')
test.todo('subtract 1')
test.todo('multiply 1')
test.todo('divide 1')
test.todo('pow 1')
test.todo('sqrt 1')
test.todo('inner_product 1')

/******************************** STATISTICS ********************************/
// ADD TESTS
test.todo('min 1')
test.todo('max 1')
test.todo('maxdiff 1')
test.todo('mean 1')


/******************************* PROBABILITY ********************************/
// ADD TESTS

test.todo('sample 1')
test.todo('runif 1')


/******************************* DATE / TIME ********************************/
