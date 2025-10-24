const hre = require("hardhat");

async function main() {
  console.log("Deploying PredictionMarket contract...");

  // Get the contract factory
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");

  // Deploy the contract
  const predictionMarket = await PredictionMarket.deploy();

  await predictionMarket.waitForDeployment();

  const address = await predictionMarket.getAddress();

  console.log("✅ PredictionMarket deployed to:", address);
  console.log("📝 Admin address:", "0x0425461847ea2825AFcA4573b2A99A02002F67a5");
  
  // Wait for block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await predictionMarket.deploymentTransaction().wait(5);
  
  console.log("✅ Deployment confirmed!");
  
  // Verify contract on BSCScan (if not on localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 Verifying contract on BSCScan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on BSCScan");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n📋 Deployment Summary:");
  console.log("─────────────────────────────────────────────");
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", address);
  console.log("Admin Address:", "0x0425461847ea2825AFcA4573b2A99A02002F67a5");
  console.log("─────────────────────────────────────────────");
  console.log("\n🚀 Next steps:");
  console.log("1. Update contract address in wagmi config");
  console.log("2. Update ABI in app/contracts/abi.ts");
  console.log("3. Test contract functions");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

