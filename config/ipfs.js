import path from "path";
import os from "os";

const repoName = ".ptp-ipfs-repo";

export default {
  silent: true,
  repo: path.resolve(os.homedir(), repoName),
};
