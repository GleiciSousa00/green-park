const Boleto = require("../models/boleto.js");
const Lote = require("../models/lote.js");
const { PDFDocument } = require("pdf-lib");
const outputDir = "./output";
const path = require("path");
const { Op } = require("sequelize");
var pdfmake = require('pdfmake');
const fs = require('fs');
var fonts = {
    Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
};


class UploadBoletosService {
    async saveInformations(data) {
        const { nomesLote, idsLote } = await this.getLotesInfo();
        for (let i = 0; i < nomesLote.length; i++) {
            if (data.unidade == nomesLote[i]) {
                await Boleto.create({
                    nome_sacado: data.nome,
                    id_lote: idsLote[i],
                    valor: Number(data.valor).toFixed(2),
                    linha_digitavel: data.linha_digitavel,
                    ativo: true,
                    criado_em: new Date(),
                });
            }
        }
    }

    async getLotesInfo() {
        const lotes = await Lote.findAll();
        const nomesLote = lotes.map((lote) => parseInt(lote.nome));
        const idsLote = lotes.map((lote) => parseInt(lote.id));

        return { nomesLote, idsLote };
    }

    async generatePdfFile(boletos) {

        return new Promise((resolve, reject) => {

            try {


                console.log(boletos)
                const data = boletos.map((boleto) => ({
                    nome: boleto.nome_sacado,
                    id: boleto.id,
                    valor: boleto.valor,
                    linha_digitavel: boleto.linha_digitavel,
                    ativo: boleto.ativo,
                    criado_em: boleto.criado_em,
                    id_lote: boleto.id_lote,
                }));


                var printer = new pdfmake(fonts);
                var body = [];
                body.push(['Nome', 'ID', 'Valor', 'Linha Digitavel', 'Ativo', 'Criado Em', 'ID Lote']);
                body.push(...data.map((row) => ([
                    `${row.nome}`,
                    `${row.id}`,
                    `${row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                    `${row.linha_digitavel}`,
                    `${row.ativo}`,
                    `${new Date(row.criado_em).toLocaleDateString('pt-BR')}`,
                    `${row.id_lote}`
                ])))

                var docDefinition = {
                    content: [
                        {
                            table: {
                                body: body
                            }
                        }
                    ]
                };

                var pdfDoc = printer.createPdfKitDocument(docDefinition);

                var chunks = [];

                pdfDoc.on('data', chunk => chunks.push(chunk));

                pdfDoc.on('end', () => {
                    var result = Buffer.concat(chunks);
                    var base64 = result.toString('base64');
                    return resolve({
                        base64
                    });
                });
                pdfDoc.end();

            } catch (error) {
                reject(error)
            }

        });
    }

    async findBoletos(query) {
        try {
            let boletos = await Boleto.findAll({
                where: query,
                order: [['id', 'ASC']],
                attributes: ['id', 'nome_sacado', 'valor', 'linha_digitavel', 'ativo', 'criado_em', 'id_lote'],
            });
            return boletos;
        } catch (err) {
            console.error(err);
            return [];
        }
    }


    async getAllBoletos({ nome, valor_inicial, valor_final, id, relatorio }) {

        let query = {};



        if (nome) {
            query.nome_sacado = { [Op.like]: `%${nome}%` };
        }
        if (id) {
            query.id = { [Op.like]: `%${id}%` };
        }
        if (valor_inicial) {
            query.valor = { ...query.valor, [Op.gte]: valor_inicial };
        }
        if (valor_final) {
            query.valor = { ...query.valor, [Op.lte]: valor_final };
        }

     
        const boleto = await this.findBoletos(query);

        if (relatorio) {
            const relat =  await this.generatePdfFile(boleto);
            // Apenas para testar o retorno do pdf
            // var data = Buffer.from(relat.base64, 'base64');
            // fs.writeFileSync(`./teste/output.pdf`, data, {encoding: 'base64'});
            return relat
        }



        return boleto;
    }


    async splitPdfIntoIndividualPages(dataBuffer, numPages) {
        const originalDoc = await PDFDocument.load(dataBuffer);

        for (let i = 0; i < numPages; i++) {
            const newDoc = await PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(originalDoc, [i]);
            newDoc.addPage(copiedPage);
            const pdfBytes = await newDoc.save();
            fs.writeFileSync(`./output/output${i + 1}.pdf`, pdfBytes);
        }
        return;
    }

    async renamePages(pages) {
        let arrayDeNomes = await Boleto.findAll({
            attributes: ["nome_sacado", "id"],
        });

        const namesAndIds = arrayDeNomes.map((entry) => ({
            name: entry.nome_sacado,
            id: entry.id,
        }));

        for (let [index, page] of pages.entries()) {
            for (let entry of namesAndIds) {
                if (page.includes(entry.name)) {
                    console.log(
                        `O nome ${entry.name} com ID ${entry.id} foi encontrado na página ${index}`
                    );
                    if (fs.existsSync(path.join(outputDir, `output${index}.pdf`))) {
                        fs.renameSync(
                            `./output/output${index}.pdf`,
                            `./output/${entry.id}.pdf`
                        );
                    }
                }
            }
        }
    }
}

module.exports = UploadBoletosService;
