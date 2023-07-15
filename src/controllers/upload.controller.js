const fs = require('fs');
const csvParser = require('csv-parser');
const UploadService = require('../services/upload.service.js');
const pdfParse = require('pdf-parse');

class UploadController {
    async processPdfFile(req, res) {
        try {
            const uploadService = new UploadService();
    
            let dataBuffer = fs.readFileSync(req.file.path);
    
            const data = await pdfParse(dataBuffer);
            const numPages = data.numpages;
            const text = data.text;
            const pages = text.split('GREEN PARK');
    
            await uploadService.splitPdfIntoIndividualPages(dataBuffer, numPages);
            await uploadService.renamePages(pages);
    
            return res.status(200).json({ message: 'Arquivo .PDF carregado e processado com sucesso!' });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao carregar arquivo .PDF' });
        }
    }
    
    async processCSVFile(req, res) {
        try {
        const uploadService = new UploadService();
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', async (data) => {

                await uploadService.saveInformations(data);

            }).on('end', () => {
                fs.unlinkSync(req.file.path);
                return res.status(200).json({ message: 'Arquivo .CSV carregado e processado com sucesso!' });
            });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao carregar arquivo .CSV' });
        }
    };

    async getBoletoList(req, res) {
        try {
            const uploadService = new UploadService();

            const { nome, valor_inicial, valor_final, id, relatorio } = req.query;

            const boletos = await uploadService.getAllBoletos({ nome, valor_inicial, valor_final, id, relatorio });

            
            return res.status(200).json(boletos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao carregar lista de boletos' });
        }
    }
}

module.exports = UploadController;
