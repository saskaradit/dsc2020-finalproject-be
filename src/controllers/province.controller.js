const dbPool = require('../config/db')

// Get All Provinces √
// Insert Provinces √
// Update Provinces
// Delete Provinces
// Get Province √

const getProvince = async (req,res) => {
  const {provinceId} = req.params;
  const connect = await dbPool.getConnection();
  let query=""
  let results;

  try {
    if(provinceId !== undefined){
      query = `SELECT name,recovered,death,positive FROM provinces WHERE id = ? AND deleted_at IS NULL`
      results = await connect.execute(query,[provinceId])
      if(results[0].length<1) return res.send({status:false,message:"Id Not Found"})
    }else{
      query = `SELECT name,recovered,death,positive FROM provinces WHERE deleted_at IS NULL`
      results = await connect.execute(query)
    }
    await connect.release();
    res.send({status:true,totalData:results.length, message:"Fetching Data Success", data:results[0]})
  } catch (error) {
    await connect.release();
    res.send({status:false,message:"Fetching Data Failed"})
  }

}

const addProvince = async (req,res) => {
  const connect = await dbPool.getConnection();
  let results;
  try {
    const {name,recovered,death,positive} = req.body;
    let query = "INSERT INTO provinces (name,recovered,death,positive) VALUES (?,?,?,?)"
    results = await connect.execute(query,[name,recovered,death,positive])

    await connect.release();
    res.send({status:true,message:"Storing Data Success", stored:req.body})
  } catch (error) {
    console.log(error)
    res.send({status:false,message:"Storing Data Failed"})
  }
}

const updateProvince = async (req,res) =>{
  const {provinceId} = req.params
  const {name,recovered,death,positive} = req.body;
  let query = "", oldProvince,newProvince
  const connect = await dbPool.getConnection();
  try {
    query = `SELECT name,recovered,death,positive FROM provinces WHERE id = ? AND deleted_at IS NULL`;
    oldProvince = await connect.execute(query,[provinceId])
    if(oldProvince[0].length<1) return res.send({status:false,message:"Id Not Found"})

    query = "UPDATE provinces SET name = ?,recovered = ?,death = ?,positive = ? WHERE id = ?"
    newProvince = await connect.execute(query,[name,recovered,death,positive,provinceId])

    await connect.release();
    res.send({status:true,message:"Update Data Success", before:oldProvince[0], after:req.body})

  } catch (error) {
    console.log(error)
    res.send({status:false,message:"Updating Data Failed"})
  }
}

const deleteProvince = async (req,res) =>{
  const connect = await dbPool.getConnection();
  let results,delResult;
  try {
    const {provinceId} = req.params
    const getQuery = `SELECT name,recovered,death,positive FROM provinces WHERE id = ? AND deleted_at IS NULL`
    results = await connect.execute(getQuery,[provinceId])
    if(results[0].length<1) return res.send({status:false,message:"Id Not Found"})
    const query = 'UPDATE provinces SET deleted_at = ? WHERE id = ?'
    delResult = await connect.execute(query,[new Date(),provinceId])

    await connect.release();
    res.send({ status:true, message:"Destroy Data Success",stored:results[0]})
  } catch (error) {
    console.log(error)
    res.send({status:false,message:"Destroy Data Failed"})
  }
}

module.exports = {
  addProvince,getProvince,updateProvince,deleteProvince
}
