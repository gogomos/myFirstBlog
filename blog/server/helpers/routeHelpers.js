function isActivateRoute(route, currentRoute){
    return route === currentRoute ? 'active' : "";
}

module.exports = { isActivateRoute };