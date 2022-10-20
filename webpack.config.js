module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif|jp2|webp|pdf)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      }
    }
  ]
}