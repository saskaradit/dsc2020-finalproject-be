const express = require('express')

const {addProvince,getProvince,updateProvince,deleteProvince } = require('../../controllers/province.controller')

const router = express.Router();

router.route('/')
  .get(getProvince)
  .post(addProvince)

router.route('/:provinceId')
  .get(getProvince)
  .patch(updateProvince)
  .delete(deleteProvince)

module.exports = router;