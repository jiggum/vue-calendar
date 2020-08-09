class RouteService {
  // eslint-disable-next-line class-methods-use-this
  getPath() {
    return window.location.hash.replace(/^#/, '')
  }

  // eslint-disable-next-line class-methods-use-this
  navigate(path: string) {
    window.location.hash = path
  }

  match(path: string, currentPath?: string) {
    const targetPath = currentPath ? currentPath.replace(/^#/, '') : this.getPath()
    const pathArray = path.split(/:\w+/)
    const pathRegex = RegExp(`^${pathArray.join('(\\w+)')}`)
    const params = path.match(/(?!:)\w+/g) || []
    const execResult = pathRegex.exec(targetPath)
    if (!execResult) return null
    return params.reduce(
      (acc, val, index) => ({
        ...acc,
        [val]: execResult[index + 1],
      }),
      {},
    )
  }
}

export default new RouteService()
