pragma solidity 0.4.25;

contract NotarizedFiles {

    struct NotarizedFile {
        string name;
        string fileUrl;
    }

    bytes32[] public filesByHash;
    mapping (bytes32 => NotarizedFile) public notarizedFiles;

    event FileAdded(bytes32 notarizedHash);
    event FileRemoved(bytes32 notarizedHash);

    /**
     * @notice Agrega archivos notaizados en el mapping (notarizedFiles)
     * y al arreglo (filesByHash).
     * @param _notarizedHash El sha256 del archivo subido.
     * @param _name El nombre del usuario que subio el archivo.
     * @param _fileUrl La url donde se encuentra fisicamente del archivo.
     * @return Retorna true si los datos fueron persistidos.
     */
    function addFile(bytes32 _notarizedHash, string _name, string _fileUrl)
        external returns(bool)
    {
        require(_notarizedHash.length != 0, "El hash es requerido");
        require(bytes(_name).length != 0, "El nombre es requerido");
        require(bytes(_fileUrl).length != 0, "La URL es requerida");
        require(
            bytes(notarizedFiles[_notarizedHash].name).length == 0,
            "El archivo fue agregado previamente"
        );

        notarizedFiles[_notarizedHash].name = _name;
        notarizedFiles[_notarizedHash].fileUrl = _fileUrl;
        filesByHash.push(_notarizedHash);

        emit FileAdded(_notarizedHash);
        return true;
    }

    /**
     * @notice Esta funcion es para eliminar logicamente una notarizacion de un
     * archivo.
     * @param _notarizedHash El sha256 del archivo previamente persistido.
     */
    function removeFile(bytes32 _notarizedHash) external {
        require(_notarizedHash.length != 0, "El hash es requerido");
        require(
            bytes(notarizedFiles[_notarizedHash].name).length != 0,
            "El archivo no existe"
        );

        notarizedFiles[_notarizedHash].name = "";
        notarizedFiles[_notarizedHash].fileUrl = "";
        _removeHash(_notarizedHash);

        emit FileRemoved(_notarizedHash);
    }

    /**
     * @notice Esta funcion es para consultar la cantidad de archivos agregados
     * hasta el momento.
     * @dev Sirve para poder iterar el arreglo que tiene todos los archivos
     * desde la Dapp.
     * @return Retorna la cantindad de archivos.
     */
    function getNumberOfFiles() external view returns(uint256) {
        return filesByHash.length;
    }

    /**
     * @notice Retorna la metadata de un archivo notarizado.
     * desde la Dapp.
     * @param _notarizedHash El sha256 del archivo previamente persistido.
     * @return Retorna el nombre y la url.
     */
    function getFileByHash(bytes32 _notarizedHash) external view
        returns(string memory, string memory)
    {
        require(_notarizedHash.length != 0, "El hash es requerido");
        require(
            bytes(notarizedFiles[_notarizedHash].name).length != 0,
            "El archivo no existe"
        );

        NotarizedFile memory notarizedFile = notarizedFiles[_notarizedHash];
        return (notarizedFile.name, notarizedFile.fileUrl);
    }

    function _removeHash(bytes32 _hash) internal {
        uint length = filesByHash.length;
        for (uint i = 0; i < length; i++) {
            if (filesByHash[i] == _hash) {
                filesByHash[i] = filesByHash[length-1];
                filesByHash.length--;
                return;
            }
        }
    }
}
