class MixAsset {
  apply (compiler) {
    compiler.hooks.emit.tap('MixAsset', (compilation) => {
      console.log('The compiler is starting a new compilation...')

      let stats = compilation.getStats().toJson();

      console.log(stats.assetsByChunkName, stats.assets, stats.namedChunkGroups);
    })
  }
}

module.exports = MixAsset