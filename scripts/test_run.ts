
async function main() {
    console.log("HELLO HARDHAT WORLD");
    const fs = require("fs");
    fs.writeFileSync("test_output.txt", "IT WORKED");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
