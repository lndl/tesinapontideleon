const {ERROR_MSG} = require('./setup');
const NotarizedFiles = artifacts.require("NotarizedFiles.sol");

contract('Contrato NotarizedFile', async (accounts) => {
    let notarizedFiles;
    const hash = '0xAE7951ED20D92F517473C468E3CC7AC01D7BD6FB177D404C0B9F8C0BD4897E9F';
    const url = 'file://cypherpunks_manifesto.txt';
    const name = 'johnConnor'
    const hash2 = '0x2B31EAC899746F9D14DDE3872C2D367C692D37D04961EBC00F3DA9C6990E81A1';
    const url2 = 'file://zerocool.pgp';
    const name2 = 'rosanelda'
    const hash3 = '0x4D64AE0A54325F02087CAD8814B81F88CB64DD14FF95E939F17D71951D7290E8';
    const url3 = 'file://RADME.md';
    const name3 = 'elChavo'

    beforeEach(async () => {
        notarizedFiles = await NotarizedFiles.new();
    });

   it('No permitir subir archivos duplicados', async () => {
        await notarizedFiles.addFile(hash, name, url).should.be.fulfilled;
        await notarizedFiles.addFile(hash, name, url).should.be.rejectedWith(ERROR_MSG);
    });

    it('Solo se pueden borrar archivos previamente agregados', async () => {
        await notarizedFiles.addFile(hash, name, url).should.be.fulfilled;
        await notarizedFiles.removeFile(hash2).should.be.rejectedWith(ERROR_MSG);
        await notarizedFiles.removeFile(hash).should.be.fulfilled;
    });

    it('Los datos guardados son los mismos que son consultados', async () => {
        await notarizedFiles.addFile(hash, name, url).should.be.fulfilled;
        const [nameResult] = await notarizedFiles.getFileByHash(hash);
        nameResult.should.be.equal(name);
    });

    it('Iteracion sobre multiples archivos', async () => {
        await notarizedFiles.addFile(hash, name, url).should.be.fulfilled;
        await notarizedFiles.addFile(hash2, name2, url2).should.be.fulfilled;
        await notarizedFiles.addFile(hash3, name3, url3).should.be.fulfilled;
        const hashes = [hash, hash2, hash3];
        const count = await notarizedFiles.getNumberOfFiles();
        let result;
        for(i = 0; i < count; i++) {
            result = await notarizedFiles.filesByHash(i);
            hashes[i].toLowerCase().should.be.equal(result.toLowerCase());
        }
    });

    it('Superposicion de clave en el mapping', async () => {
        // Los 16 bytes mas significativos iguales.
        const hash = '0x99BAEE504A1FE91A07BC66B6900BD3981D7BD6FB177D404C0B9F8C0BD4897E9F';
        const has2 = '0x99BAEE504A1FE91A07BC66B6900BD398692D37D04961EBC00F3DA9C6990E81A1';
        await notarizedFiles.addFile(hash, name, url).should.be.fulfilled;
        await notarizedFiles.addFile(has2, name2, url2).should.be.fulfilled;
        let [nameResult] = await notarizedFiles.getFileByHash(hash);
        nameResult.should.be.equal(name);
        [nameResult] = await notarizedFiles.getFileByHash(has2);
        nameResult.should.be.equal(name2);
        // Ultimos 16 bytes iguales.
        const has3 = '0x1D7BD6FB177D404C0B9F8C0BD4897E9F99BAEE504A1FE91A07BC66B6900BD398';
        const has4 = '0x692D37D04961EBC00F3DA9C6990E81A199BAEE504A1FE91A07BC66B6900BD398';
        await notarizedFiles.addFile(has3, name, url).should.be.fulfilled;
        await notarizedFiles.addFile(has4, name2, url2).should.be.fulfilled;
        [nameResult] = await notarizedFiles.getFileByHash(has3);
        nameResult.should.be.equal(name);
        [nameResult] = await notarizedFiles.getFileByHash(has4);
        nameResult.should.be.equal(name2);
    });
});
