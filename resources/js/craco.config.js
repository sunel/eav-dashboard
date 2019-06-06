const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const reactHotReloadPlugin = require('craco-plugin-react-hot-reload');
const CracoAntDesignPlugin = require('craco-antd');

process.env.BROWSER = "none";

module.exports = function({env}) {

  const plugins = [
    { 
      plugin: CracoAntDesignPlugin ,
      options: {
        customizeThemeLessPath: path.join(
          __dirname,
          "src/style/AntDesign/customTheme.less"
        )
      }
    }
  ];

  if (env === 'production') {
    return {
      plugins: [...plugins],
      webpack: {
          plugins: [
            new HtmlWebpackPlugin({
              title: 'EAV Dashboard',
              inject: false,
              filename: 'mix.html',
              template: path.resolve(__dirname, 'scripts/mix.html')
            })
          ],
      }
    };
  }
  return {
    plugins: [...plugins, {
      plugin: reactHotReloadPlugin
    }],
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => { 

      devServerConfig.historyApiFallback = true
      
      return devServerConfig; 
    },
  };
};
