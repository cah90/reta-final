const express = require("express")
const server = express()
const port = process.env.PORT || 3000
const pool = require("./db")
const moment = require("moment")

const nunjucks = require("nunjucks")

server.use(express.static("public"))

server.set("view engine", "njk")

nunjucks.configure("views", {
  express: server,
  autoescape: false,
  noCache: true
})

server.use(express.urlencoded({extended: true}))


//*ROUTES
//*INICIAL
server.get("/", async (req, res) => {
  return res.redirect("/campeonatos")
})

// LOGIN
server.get("/admin/login", async(req,res) => {

  return res.render("login")
})

server.post("/admin/login", async(req,res) => {
  return res.redirect("/admin/campeonatos")
})

//UNIDADE
server.get("/admin/unidades", async (req, res) => {
  const client = await pool.connect()
  let rows

  try {
    const res = await client.query('SELECT * FROM unidades')
    //console.log(res.rows)
    rows = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let adicionado_com_sucesso = req.query.adicionado_com_sucesso

  let templateVars = { 
    items: rows,
    adicionado_com_sucesso: adicionado_com_sucesso
  }

  console.log(templateVars)

  return res.render("unidades", templateVars)
})

server.get("/admin/adicionar-unidade", async (req, res) => {
  return res.render("add-unidade")
})

server.post("/admin/adicionar-unidade-process", async (req, res) => {
  //console.log(req.body)

  const client = await pool.connect()

  const text = "INSERT INTO unidades(nome, endereco, numero, complemento, cep, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7)"
  const values = [
    req.body.nome, 
    req.body.endereco, 
    req.body.numero, 
    req.body.complemento, 
    req.body.cep, 
    req.body.cidade,
    req.body.estado
  ]

  let adicionado_com_sucesso

  try {
    const res = await client.query(text, values)
    console.log(res.rows[0])
    adicionado_com_sucesso = 1
  } catch(err) {
    console.log(err.stack)
    adicionado_com_sucesso = 0
  } finally {
    client.release()
  } 

  

  res.redirect(`/admin/unidades?adicionado_com_sucesso=${adicionado_com_sucesso}`)
})

server.get("/admin/delete-unidade/:id", async (req, res) => {
  console.log(req.params.id)

  const client = await pool.connect()

  const text = "DELETE FROM unidades WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
  } catch(err) {
    console.log(err.stack)
  } finally {
    client.release()
  } 

  res.redirect("/admin/unidades")
})

server.get("/admin/edit-unidade/:id", async (req,res) => {
  console.log(req.params.id)

  const client = await pool.connect()
  let rows

  const text = "SELECT * FROM unidades WHERE id = $1"
  const values = [
    req.params.id
  ]
  

  try {
    const res = await client.query(text, values)
    rows = res.rows[0]
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } finally {
    client.release()
  } 

  //console.log(rows)

  return res.render("edit-unidade", rows)
})

server.post("/admin/edit-unidade-process/:id", async (req, res) => {
  //console.log(req.body)

  console.log(req.params)

  const client = await pool.connect()

  const text = `
    UPDATE unidades
    SET nome=$1,
        endereco=$2, 
        numero=$3, 
        complemento=$4, 
        cep=$5, 
        cidade=$6, 
        estado=$7
    WHERE id=$8`
  const values = [
    req.body.nome, 
    req.body.endereco, 
    req.body.numero, 
    req.body.complemento, 
    req.body.cep, 
    req.body.cidade,
    req.body.estado,
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
    
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  
  return res.redirect("/admin/unidades")

})



//*QUADRA
server.get("/admin/quadras", async (req, res) => {
  const client = await pool.connect()
  let rows
  let adicionado_com_sucesso = req.query.adicionado_com_sucesso

  try {
    const res = await client.query(
      'SELECT q.id, q.nome AS nome_quadra, u.nome AS nome_unidade, u.endereco,u.numero, u.complemento, u.cep, u.cidade, u.estado FROM quadras q INNER JOIN unidades u ON u.id = q.unidade_id;')
      rows = res.rows
      
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let templateVars = {
    items: rows,
    adicionado_com_sucesso: adicionado_com_sucesso
  }

  return res.render("quadras", templateVars)
})

server.get("/admin/adicionar-quadra", async (req,res) => {
  const client = await pool.connect()
  let rows

  try {
    const res = await client.query(
      'SELECT id, nome FROM unidades')
    console.log(res.rows)
    rows = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let templateVars = {
    items: rows
  }

  
  return res.render("add-quadra", templateVars)
})

server.post("/admin/adicionar-quadra-process", async (req,res) => {
  //console.log(req.body)

  let adicionado_com_sucesso

  const client = await pool.connect()

  const text = "INSERT INTO quadras(nome, unidade_id) VALUES ($1, $2)"
  const values = [
    req.body.nome, 
    req.body.unidade_id
    
  ]

  try {
    const res = await client.query(text, values)
    console.log(res.rows[0])
    adicionado_com_sucesso = 1
  } catch(err) {
    console.log(err.stack)
    adicionado_com_sucesso = 0
  } finally {
    client.release()
  } 


  res.redirect(`/admin/quadras?adicionado_com_sucesso=${adicionado_com_sucesso}`)
})

server.get("/admin/delete-quadra/:id", async (req, res) => {
  //console.log(req.params.id)

  const client = await pool.connect()

  const text = "DELETE FROM quadras WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
  } catch(err) {
    console.log(err.stack)
  } finally {
    client.release()
  } 

  res.redirect("/admin/quadras")
})

server.get("/admin/edit-quadra/:id", async (req,res) => {
  console.log(req.params.id)

  const client = await pool.connect()
  let item

  const text = "SELECT * FROM quadras WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
    item = res.rows[0]
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  const query = "SELECT * FROM unidades"

  try {
    const res = await client.query(query)
    unidades = res.rows
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  client.release()
  //console.log(rows)

  let templateVars = { 
    quadra: item,
    unidades: unidades
  }

  //console.log(templateVars)

  return res.render("edit-quadra", templateVars)
})

server.post("/admin/edit-quadra-process/:id", async (req, res) => {

  console.log(req.params)

  const client = await pool.connect()

  const text = `
    UPDATE quadras
    SET nome=$1,
        unidade_id=$2
    WHERE id=$3`
  const values = [
    req.body.nome, 
    req.body.unidade_id,
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
    
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  
  return res.redirect("/admin/quadras")
})


//*CAMPEONATO
server.get("/admin/campeonatos", async (req,res) => {
  const client = await pool.connect()
  let rows
  let adicionado_com_sucesso = req.query.adicionado_com_sucesso
  let edit_com_sucesso = req.query.edit_com_sucesso

  try {
    const result = await client.query(
      `SELECT 
      c.id, 
      c.nome AS nome_campeonato, 
      u.nome AS nome_unidade, 
      c.inscricao_inicio,
      c.inscricao_fim,
      c.jogos_inicio,
      c.jogos_fim,
      c.divulgacao,
      c.status
      FROM campeonatos c INNER JOIN unidades u ON u.id = c.unidade_id;`)

      rows = result.rows
      
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  
  rows.forEach(function(row) {
  
    row.inscricao_inicio = moment(row.inscricao_inicio).format("DD/MM/YYYY")
    row.inscricao_fim = moment(row.inscricao_fim).format("DD/MM/YYYY")
    row.jogos_inicio = moment(row.jogos_inicio).format("DD/MM/YYYY")
    row.jogos_fim = moment(row.jogos_fim).format("DD/MM/YYYY")
    row.divulgacao = moment(row.divulgacao).format("DD/MM/YYYY")
  
  })

  let nunjucks_variaveis = {
    items: rows,
    adicionado_com_sucesso: adicionado_com_sucesso,
    edit_com_sucesso: edit_com_sucesso
  }

  //console.log(nunjucks_variaveis)

  return res.render("campeonatos", nunjucks_variaveis)
})

server.get("/admin/adicionar-campeonato", async (req, res) => {
  const client = await pool.connect()
  let rows

  try {
    const res = await client.query(
      'SELECT id, nome FROM unidades')
    //console.log(res.rows)
    rows = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let templateVars = {
    items: rows
  }
  return res.render("add-campeonato", templateVars)
})
 
server.post("/admin/adicionar-campeonato-process", async (req,res) => {
  //console.log(req.body)
  let adicionado_com_sucesso

  const client = await pool.connect()

  const text = `INSERT INTO campeonatos(
    nome, 
    unidade_id, 
    inscricao_inicio,
    inscricao_fim,
    jogos_inicio,
    jogos_fim,
    divulgacao
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`
  const values = [
    req.body.nome, 
    req.body.unidade_id,
    req.body.data_inicio_inscricoes,
    req.body.data_fim_inscricoes,
    req.body.data_inicio_jogos,
    req.body.data_fim_jogos,
    req.body.data_divulgacao
  ]

  try {
    const result = await client.query(text, values)
    console.log("Campeonato adicionado!")
    adicionado_com_sucesso = 1
  } catch(err) {
    console.log(err.stack)
    adicionado_com_sucesso = 0
  } finally {
    client.release()
  } 

  res.redirect(`/admin/campeonatos?adicionado_com_sucesso=${adicionado_com_sucesso}`)
})

server.get("/admin/edit-campeonato/:id", async (req,res) => {
  // console.log(req.params.id)

  const client = await pool.connect()
  let item

  const text = "SELECT * FROM campeonatos WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const result = await client.query(text, values)
    campeonato = result.rows[0]
    // console.log("essas é a variavel item")
    // console.log(result.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  const query = "SELECT * FROM unidades"

  try {
    const result = await client.query(query)
    unidades = result.rows
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  client.release()
  //console.log(rows)

  
  campeonato.inscricao_inicio = moment(campeonato.inscricao_inicio).format("YYYY-MM-DD")
  campeonato.inscricao_fim = moment(campeonato.inscricao_fim).format("YYYY-MM-DD")
  campeonato.jogos_inicio = moment(campeonato.jogos_inicio).format("YYYY-MM-DD")
  campeonato.jogos_fim = moment(campeonato.jogos_fim).format("YYYY-MM-DD")
  campeonato.divulgacao = moment(campeonato.divulgacao).format("YYYY-MM-DD")

  let statuses = ["planejado", "andamento", "cancelado", "executado"]

  let templateVars = { 
    campeonato: campeonato,
    unidades: unidades, 
    statuses: statuses
  }

   //console.log("--- TEMPLATEVARS ---")
   //console.log(templateVars)

return res.render("edit-campeonato", templateVars)
})

server.post("/admin/edit-campeonato-process/:id", async (req, res) => {
  // console.log(`Esse é o req.params`)
  // console.log(req.params)

  let edit_com_sucesso

  const client = await pool.connect()

  const text = `
    UPDATE campeonatos
    SET nome=$1,
        unidade_id=$2,
        inscricao_inicio=$3,
        inscricao_fim=$4,
        jogos_inicio=$5,
        jogos_fim=$6,
        divulgacao=$7,
        status=$8
    WHERE id=$9`
  const values = [
    req.body.nome, 
    req.body.unidade_id,
    req.body.inscricao_inicio,
    req.body.inscricao_fim,
    req.body.jogos_inicio,
    req.body.jogos_fim,
    req.body.divulgacao,
    req.body.status,
    req.params.id
  ]

  //console.log(values)

  try {
    const result = await client.query(text, values)
    edit_com_sucesso = 1
  } catch(err) {
    console.log(err)
    edit_com_sucesso = 0
  } finally {
    client.release()
  } 

  
  return res.redirect(`/admin/campeonatos?edit_com_sucesso=${edit_com_sucesso}`)
})

server.get("/admin/delete-campeonato/:id", async (req, res) => {
  //console.log(req.params.id)

  const client = await pool.connect()

  const text = "DELETE FROM campeonatos WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const res = await client.query(text, values)
  } catch(err) {
    console.log(err.stack)
  } finally {
    client.release()
  } 

  res.redirect("/admin/campeonatos")
})

server.get("/admin/config-campeonato/:id", async (req, res) => {
   //console.log("id" + req.params.id)

  let adicionado_com_sucesso = req.query.adicionado_com_sucesso
  let adicionar_jogo_com_sucesso = req.query.adicionar_jogo_com_sucesso
  let adicionar_vencedor_com_sucesso = req.query.adicionar_vencedor_com_sucesso
  

  const client = await pool.connect()
  let item

  const text = "SELECT * FROM campeonatos WHERE id = $1"
  const values = [
    req.params.id
  ]

  try {
    const result = await client.query(text, values)
    campeonato = result.rows[0]
    // console.log("essas é a variavel item")
    // console.log(result.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  const query = `
    SELECT unidades.nome 
    FROM campeonatos 
    INNER JOIN unidades
    ON unidades.id = campeonatos.unidade_id
    WHERE campeonatos.id = $1`

  try {
    const result = await client.query(query, values)
    unidades = result.rows[0]
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  const queryTimesJogos = `
  SELECT  t1.nome AS t1_nome,
          t2.nome AS t2_nome,
          j.id,
          j.rodada,
          j.data_jogo,
          j.horario_jogo,
          q.nome
 
  FROM jogos j
  INNER JOIN times t1 ON j.time1_id = t1.id
  INNER JOIN times t2 ON j.time2_id = t2.id
  INNER JOIN quadras q ON q.id = j.quadra_id
  WHERE t1.campeonato_id = $1`

  try {
    const result = await client.query(queryTimesJogos, values)
    timesJogos = result.rows
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 

  const queryTimes = `
  SELECT *
  FROM times
  WHERE campeonato_id = $1`

  try {
    const result = await client.query(queryTimes, values)
    times = result.rows
    //console.log(res.rows)

  } catch(err) {
    console.log(err.stack)
  } 
  
  


  client.release()
  //console.log(rows)

  
  campeonato.inscricao_inicio = moment(campeonato.inscricao_inicio).format("DD/MM/YYYY")
  campeonato.inscricao_fim = moment(campeonato.inscricao_fim).format("DD/MM/YYYY")
  campeonato.jogos_inicio = moment(campeonato.jogos_inicio).format("DD/MM/YYYY")
  campeonato.jogos_fim = moment(campeonato.jogos_fim).format("DD/MM/YYYY")
  campeonato.divulgacao = moment(campeonato.divulgacao).format("DD/MM/YYYY")
  
  for (let timeJogo of timesJogos) {
    
    timeJogo.data_jogo = moment(timeJogo.data_jogo).format("DD/MM/YYYY")
    timeJogo.horario_jogo = moment(timeJogo.horario_jogo, "HH:mm:ss").format("LT")
  }


  let templateVars = { 
    campeonato: campeonato,
    unidades: unidades,
    times: times,
    timesJogos: timesJogos,
    adicionado_com_sucesso: adicionado_com_sucesso,
    adicionar_jogo_com_sucesso: adicionar_jogo_com_sucesso,
    adicionar_vencedor_com_sucesso: adicionar_vencedor_com_sucesso
  }

  //  console.log("--- TEMPLATEVARS ---")
  //  console.log(templateVars)


  return res.render("campeonato", templateVars)
})

//*TIME
server.get("/admin/config-campeonato/:id/add-time", async (req,res) => {
  
  const client = await pool.connect()
  let inscritos

  try {
    const res = await client.query(
      `
      SELECT id, nome 
      FROM inscritos
      WHERE inscritos.campeonato_id = $1 AND inscritos.time_id IS NULL
      `, [req.params.id])
    //console.log(res.rows)
    inscritos = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let templateVars = {
    inscritos: inscritos,
    campeonato_id: req.params.id
  }


  //console.log(templateVars)

  return res.render("add-time", templateVars)

})

server.post("/admin/config-campeonato/:id/add-time", async (req, res) => {
  console.log(req.body)

  let result, adicionado_com_sucesso

  const client = await pool.connect()

  const text = `
  INSERT INTO times(
    nome,
    campeonato_id
  ) 
  VALUES ($1, $2)
  RETURNING id`

  const values = [
    req.body.nome,
    req.params.id
  ]


  try {
    result = await client.query(text, values)
    console.log("Time adicionado!")
    adicionado_com_sucesso = 1
  } catch(err) {
    console.log(err.stack)
    adicionado_com_sucesso = 0
  } 

  const idTimeAdded = result.rows[0].id

for (player of req.body.player) {

  const players = `
  UPDATE inscritos 
  SET time_id=$1
  WHERE id=$2
  ` 

  const values = [
    idTimeAdded,
    player
  ]

  console.log(values)

  try {
    result = await client.query(players, values)
    console.log("Time adicionado!")
  } catch(err) {
    console.log(err.stack)  
  } 
}


  client.release()

  
  return res.redirect(`/admin/config-campeonato/${req.params.id}?adicionado_com_sucesso=${adicionado_com_sucesso}`)
}) 

server.get("/campeonato/:campeonato_id/time/:time_id", async (req, res) => {
  const client = await pool.connect()
  let inscritos


  try {
    const res = await client.query(
      `
      SELECT i.nome AS nome_inscrito, t.nome AS nome_time
      FROM inscritos i
      INNER JOIN times t ON t.id = i.time_id
      WHERE t.id = $1
       `, [req.params.time_id])
    //console.log(res.rows)
    inscritos = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  } 

  let templateVars = {
    inscritos: inscritos,
  }

  //console.log(inscritos)


  return res.render("time", templateVars)
})

//*JOGO
server.get("/admin/config-campeonato/:id/add-jogo", async (req,res) => {
  
  const client = await pool.connect()
  let times, quadras, adicionar_jogo_com_sucesso

  try {
    const res = await client.query(
      `
      SELECT * 
      FROM times
      WHERE campeonato_id = $1
      `, [req.params.id])

    
    //console.log(res.rows)
    times = res.rows
  } catch(err) {
    console.log(err)
  } 


  try {
    const res = await client.query(`
    SELECT quadras.* 
    FROM quadras
    INNER JOIN unidades ON unidades.id = quadras.unidade_id
    INNER JOIN campeonatos ON campeonatos.unidade_id = unidades.id
    WHERE campeonatos.id = $1
    `, [req.params.id])
    quadras = res.rows
   
  } catch(err) {
    console.log(err)
  }

  let templateVars = {
    times: times,
    quadras: quadras,
    campeonato_id: req.params.id
  }

  client.release()

  //console.log(templateVars)

  return res.render("add-jogo", templateVars)

})

server.post("/admin/config-campeonato/:id/add-jogo", async (req, res) => {
  // console.log("resultado do req.body")
  // console.log(req.body)

  let result

  const client = await pool.connect()

  const text = `
  INSERT INTO jogos(
    time1_id,
    time2_id,
    rodada,
    data_jogo,
    horario_jogo,
    quadra_id
  ) 
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id`

  const values = [
    req.body.time[0],
    req.body.time[1],
    req.body.rodada,
    req.body.data_inicio_campeonato,
    req.body.horario_campeonato,
    req.body.quadra_id
  ]

  // console.log("esses são os valores")
  // console.log(values)

  try {
    result = await client.query(text, values)
    //console.log("Jogo adicionado!")
    adicionar_jogo_com_sucesso = 1
  } catch(err) {
    console.log(err.stack)
    adicionar_jogo_com_sucesso = 0
  } finally {
    client.release()
  }


  
  return res.redirect(`/admin/config-campeonato/${req.params.id}?adicionar_jogo_com_sucesso=${adicionar_jogo_com_sucesso}`)
}) 

//*CAMPEONATOS
server.get("/campeonatos", async (req,res) => {
  
  const client = await pool.connect()
  let campeonatos

  async function  getCampeonatos(condition) {

    try {
      const res = await client.query(
        `
        SELECT c.*, u.nome AS nome_unidade
        FROM campeonatos c
        INNER JOIN unidades u 
        ON c.unidade_id = u.id
        WHERE ${condition}
        `)
  
      campeonatos = res.rows
    } catch(err) {
      console.log(err)
    } 
  
    for(campeonato of campeonatos) {
      campeonato.inscricao_inicio = moment(campeonato.inscricao_inicio).format("DD/MM/YYYY")
      campeonato.inscricao_fim = moment(campeonato.inscricao_fim).format("DD/MM/YYYY")
      campeonato.jogos_inicio = moment(campeonato.jogos_inicio).format("DD/MM/YYYY")
      campeonato.jogos_fim = moment(campeonato.jogos_fim).format("DD/MM/YYYY")
      campeonato.divulgacao = moment(campeonato.divulgacao).format("DD/MM/YYYY")
    }

    return campeonatos
    
  } //End function getCampeonatos


  const campeonatosAndamento = await getCampeonatos("c.jogos_inicio < now() AND c.jogos_fim > now()")
  const campeonatosFuturo = await getCampeonatos("c.jogos_inicio > now() AND c.jogos_fim > now()")
  const campeonatosPassado = await getCampeonatos("c.jogos_inicio < now() AND c.jogos_fim < now()")

  
  let templateVars = {
    campeonatosAndamento: campeonatosAndamento,
    campeonatosFuturo: campeonatosFuturo,
    campeonatosPassado: campeonatosPassado,
  }

  client.release()

  //console.log(templateVars)

  return res.render("lista-campeonatos", templateVars)

})

server.get("/campeonato/:id/andamento", async (req,res) => {

  const client = await pool.connect()
  let jogos

  async function getJogos(condition) {
    try {
      const result = await client.query(`
      SELECT 
        j.*, 
        t1.nome AS nome_t1,
        t1.id AS id_t1,
        t2.nome AS nome_t2,
        t2.id AS id_t2,
        q.nome AS quadra
      FROM jogos j
      INNER JOIN times t1 ON j.time1_id = t1.id
      INNER JOIN times t2 ON j.time2_id = t2.id
      INNER JOIN quadras q ON j.quadra_id = q.id
      WHERE ${condition}
      `)
  
      jogos = result.rows
        
    } catch(err) {
      console.log(err)
    } 
    
    jogos.forEach(function(row) {
      row.data_jogo = moment(row.data_jogo).format("DD/MM/YYYY")
    })
    
    return jogos
    
  } //End of the function getJogos
  
  jogosTerminados = await getJogos("j.data_jogo < now()")
  jogosFuturos = await getJogos("j.data_jogo >= now()")
  
  client.release()

  
  let nunjucks_variaveis = {
    jogosTerminados: jogosTerminados,
    jogosFuturos: jogosFuturos,
    campeonatoId: req.params.id
  }

  //console.log(jogos)

  res.render("campeonato-andamento", nunjucks_variaveis) 
})

server.get("/campeonato/:id/terminado", async (req,res) => {

  const client = await pool.connect()
  let jogos,vencedores

  async function getJogos(condition) {
    try {
      const result = await client.query(`
      SELECT
        j.*, 
        t1.nome AS nome_t1,
        t1.id AS id_t1,
        t2.nome AS nome_t2,
        t2.id AS id_t2,
        q.nome AS quadra
      FROM jogos j
      INNER JOIN times t1 ON j.time1_id = t1.id
      INNER JOIN times t2 ON j.time2_id = t2.id
      INNER JOIN quadras q ON j.quadra_id = q.id
      INNER JOIN unidades u ON u.id = q.unidade_id
      INNER JOIN campeonatos c ON c.unidade_id = u.id
      WHERE ${condition}
      `)
  
      jogos = result.rows
        
    } catch(err) {
      console.log(err)
    } finally { 
      client.release()
    }
    
    jogos.forEach(function(row) {
      row.data_jogo = moment(row.data_jogo).format("DD/MM/YYYY")
    })

    return jogos
  
  } //End of the function getJogos

  jogosTerminados = await getJogos(`j.data_jogo < now() AND c.id = ${req.params.id}`)


  try {
    const result = await client.query(`
    SELECT * 
    FROM times
    WHERE times.campeonato_id = $1
    `, [req.params.id])

    vencedores = result.rows
      
  } catch(err) {
    console.log(err)
  } 


  
  let nunjucks_variaveis = {
    jogosTerminados: jogosTerminados,
    vencedores: vencedores,
    campeonatoId: req.params.id
  }

  //console.log(jogosTerminados)

  res.render("campeonato-terminado", nunjucks_variaveis) 
})

server.get("/campeonato/:id/futuro", async (req,res) => {

  const client = await pool.connect()
  let campeonato

    try {
      const result = await client.query(`
      SELECT *
      FROM campeonatos c 
      WHERE c.id = $1
      `, [req.params.id])
  
       campeonato = result.rows[0]
        
    } catch(err) {
      console.log(err)
    } finally {
      client.release()
    }

    function decideInscricaoAberta(inscricaoInicio, inscricaoFim) {

      if(inscricaoInicio < new Date() && inscricaoFim > new Date()) {
        return true
      } else {
        return false
      } 
    }

    
    campeonato.inscricao_aberta = decideInscricaoAberta(campeonato.inscricao_inicio, campeonato.inscricao_fim)
    campeonato.inscricao_inicio = moment(campeonato.inscricao_inicio).format("DD/MM/YYYY")
    campeonato.inscricao_fim = moment(campeonato.inscricao_fim).format("DD/MM/YYYY")
    campeonato.jogos_inicio = moment(campeonato.jogos_inicio).format("DD/MM/YYYY")
    campeonato.jogos_fim = moment(campeonato.jogos_fim).format("DD/MM/YYYY")
  

  
  let nunjucks_variaveis = {
    campeonato: campeonato
  }

  //console.log(campeonato)

  res.render("campeonato-futuro", nunjucks_variaveis) 
})

server.get("/campeonato/:id/inscrever", async (req, res) => {
  let template_vars = {
    campeonato_id: req.params.id
  }

  res.render("add-inscrito", template_vars)
})

server.post("/campeonato/:id/adicionar-inscrito", async (req,res) => {

  //console.log(req.params.id)

 let result

  const client = await pool.connect()

  const text = `
  INSERT INTO inscritos(
    nome,
    whatsapp,
    apelido,
    data_nascimento,
    campeonato_id
  ) 
  VALUES ($1, $2, $3, $4, $5)
  `

  const values = [
    req.body.nome,
    req.body.whatsapp,
    req.body.apelido,
    req.body.data_nascimento,
    req.params.id
  ]

  // console.log("esses são os valores")
  // console.log(values)

  try {
    result = await client.query(text, values)
    console.log("Inscrito adicionado!")
  } catch(err) {
    console.log(err.stack)
  } finally {
    client.release()
  }
 
  return res.redirect("inscrito")
})

server.get("/campeonato/:id/inscrito", async (req,res) => {

  return res.render("inscrito")
})

server.get("/admin/campeonato/:campeonato_id/jogo/:jogo_id/adicionar-placar", async (req,res) => {

  // console.log(req.params.campeonato_id)
  // console.log(req.params.jogo_id)

  const client = await pool.connect()
  let times

  try {
    const res = await client.query(
      `
      SELECT t1.nome AS time1, t2.nome AS time2
      FROM jogos j
      INNER JOIN times t1 ON j.time1_id = t1.id
      INNER JOIN times t2 ON j.time2_id = t2.id
      WHERE j.id = $1
      `, [req.params.jogo_id])

    times = res.rows[0]
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  }

  nunjucksVariables = {
    times: times,
    campeonato_id: req.params.campeonato_id,
    jogo_id: req.params.jogo_id
  }

  //console.log(nunjucksVariables)

  return res.render("add-placar", nunjucksVariables)
})

server.post("/admin/campeonato/:campeonato_id/jogo/:jogo_id/adicionar-placar", async (req,res) => {

  
  const client = await pool.connect()

  const text = `
  UPDATE jogos
  SET time1_placar = $1,
      time2_placar = $2
  WHERE jogos.id = $3
  `

  const values = [
    req.body.time1_placar,
    req.body.time2_placar,
    req.params.jogo_id
  ]


  try {
    const res = await client.query(text, values)
    //console.log("Placar inserido!")

  } catch(err) {
    console.log(err)
  }  finally {
    client.release()
  }


  return res.redirect(`/admin/config-campeonato/${req.params.campeonato_id}`)
})


//*VENCEDORES
server.get("/admin/config-campeonato/:id/add-vencedores", async (req,res) => {

  const client = await pool.connect()
  let times

  try {
    const res = await client.query(
      `
      SELECT * 
      FROM times
      WHERE times.campeonato_id = $1
      `, [req.params.id])

    times = res.rows
  } catch(err) {
    console.log(err)
  } finally {
    client.release()
  }

  nunjucksVariables = {
    items: times,
    campeonato: req.params.id
 }

//console.log(nunjucksVariables) 

  return res.render("add-vencedores", nunjucksVariables)
})

server.post("/admin/config-campeonato/:id/add-vencedores", async (req,res) => {

  console.log(req.body)
  let adicionar_vencedor_com_sucesso

  const client = await pool.connect()

  async function addVencedores(lugar, timeId) {
    let sucesso = false

    const text = `
    UPDATE times
    SET vencedores = ${lugar}
    WHERE id = $1
    `
  
    const values = [
      timeId
    ]
  
    try {
      const res = await client.query(text, values)
      console.log(res)
      sucesso = true
    } catch(err) {
      console.log(err)
    } 
    
    return sucesso
  }
  
  
  let sucesso1 = addVencedores(1, req.body.primeiro_lugar)
  let sucesso2 = addVencedores(2, req.body.segundo_lugar)
  let sucesso3 = addVencedores(3, req.body.terceiro_lugar)
  
  client.release() 

  if(sucesso1 && sucesso2 && sucesso3) {
    adicionar_vencedor_com_sucesso = 1
  } else {
    adicionar_vencedor_com_sucesso = 0
  }

  return res.redirect(`/admin/config-campeonato/${req.params.id}?adicionar_vencedor_com_sucesso=${adicionar_vencedor_com_sucesso}`)
})

                                            


//*SERVER 
server.listen(port, () => {
  console.log(`It works. Listening on port ${port}`)
})

// mudança 1 no iteração2