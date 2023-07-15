const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/upload.controller.js');
const uploadMulter = require('../../config/multerConfig.js');

const uploadBoleto = new UploadController();

router.get('/', (req, res) => {
    res.send('Olá, Mundo!');
});

router.post('/import-boletos-csv', uploadMulter.single('file'), async (req, res) => {
  return await uploadBoleto.processCSVFile(req, res);
});

router.post('/import-boletos-pdf', uploadMulter.single('file'), async (req, res) => {
  return await uploadBoleto.processPdfFile(req, res);
});

router.get('/boletos', async (req, res) => {
  return await uploadBoleto.getBoletoList(req, res);
});

module.exports = router;
