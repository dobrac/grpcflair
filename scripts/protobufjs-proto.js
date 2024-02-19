const pbjs = require("protobufjs-cli/pbjs");
const fs = require("fs");

const filesOrFolders = process.argv.slice(2);

if (!filesOrFolders.length) {
  console.error("No file path provided");
  process.exit(1);
}

function isProtobufFile(path) {
  return path.endsWith(".proto");
}

function exists(path) {
  return fs.existsSync(path);
}

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function getFilesInFolderRecursively(folder) {
  const files = [];

  const filesInFolder = fs.readdirSync(folder);
  filesInFolder.forEach((file) => {
    const path = fs.realpathSync(`${folder}/${file}`);
    if (isDirectory(path)) {
      files.push(...getFilesInFolderRecursively(path));
    } else {
      files.push(path);
    }
  });

  return files;
}

function filesOrFoldersToFiles(filesOrFolders) {
  const files = [];
  filesOrFolders.filter(exists).forEach((fileOrFolder) => {
    if (isDirectory(fileOrFolder)) {
      files.push(...getFilesInFolderRecursively(fileOrFolder));
    } else {
      files.push(fileOrFolder);
    }
  });

  return files;
}

const files = filesOrFoldersToFiles(filesOrFolders).filter(isProtobufFile);

pbjs.main(["--alt-comment", "-t", "json", ...files], function (err, output) {
  if (err) {
    throw err;
  }

  console.log(output);
});
