function linkActive(id, pathname) {
  //console.log(`linkActive(id=${id}, pathname=${pathname}) was called`)
  
  const link = document.querySelector(id)
  //console.log(link)

  //console.log(document.location.pathname)

  if (document.location.pathname.includes(pathname)) {
    //console.log(`It was executed for id ${id} and pathname ${pathname}`)
    link.classList.add("active")
    
  }
}

linkActive('#unidades', "/admin/unidades")
linkActive('#quadras', "/admin/quadras")
linkActive('#campeonatos', "/admin/campeonatos")
