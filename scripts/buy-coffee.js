// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { cons } = require("fp-ts/lib/NonEmptyArray2v");
const hre = require("hardhat");
const { message } = require("statuses");

async function getbalance(address){
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}
async function printBalances(addresses){
  let idx=0;
  for(const address of addresses){
    console.log(`Address ${idx} balance:`, await getbalance(address));
    idx++;
  }
}
async function printMemos(memos){
  for(const memo of memos){
    const timestamp=await memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(memo)
    console.log(`At ${timestamp},${tipper},(${tipperAddress}) said:"${message}"`);
  }
  
}
async function main() {
  //Get example accounts
  const [owner,tipper,tipper2,tipper3]=await hre.ethers.getSigners();

  //Get the contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed(); 
  console.log("BuyMeACoffee deployed to ",buyMeACoffee.address);
 
  //Get balances before the coffee purchaces
  const addresses=[owner.address,tipper.address,tipper2.address,buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  //Buy the owner a few coffees
  const tip={value:hre.ethers.utils.parseEther("1.0")};
  await buyMeACoffee.connect(tipper).buyCoffee("Kerem","Cok iyimis!",tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Ahmet","Iyi",tip) 
  await buyMeACoffee.connect(tipper3).buyCoffee("Mehmet","Mukemmel",tip)    
      
  console.log("== bougth ==");
  await printBalances(addresses);  

//Withdraw funts

  await buyMeACoffee.connect(owner).withdrawTips();
  console.log("== withdraw ==");
  await printBalances(addresses); 

  console.log("== memos ==");
  const memos= await buyMeACoffee.getMemos();
  printMemos(memos);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


/*--------------------SORULCAK SORULAR----------------------*
1.tip nesnesini fonksiyona yazmamamıza rağmen contrata eth nasıl gidiyor
2.memosları gösterirken timestamp undefined gözüküyor çözümü ve nedeni
*/
