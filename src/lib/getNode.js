import Ipfs from "ipfs-core";
import config from "../config/index.js"

const getNode = async () => {
  const node = await Ipfs.create(config.ipfs);
  return node;
};

export default getNode;
