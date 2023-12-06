CREATE TABLE unidades (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  nome varchar NOT NULL,
  endereco varchar NOT NULL,
  numero varchar,
  complemento varchar,
  cep varchar NOT NULL,
  cidade varchar,
  estado varchar
 );
 
CREATE TABLE quadras (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  nome varchar NOT NULL,
  unidade_id int,
  CONSTRAINT fk_unidade FOREIGN KEY(unidade_id) REFERENCES unidades(id)
  ON DELETE CASCADE
);

CREATE TABLE campeonatos (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  nome varchar NOT NULL,
  unidade_id int,
  inscricao_inicio date,
  inscricao_fim date,
  jogos_inicio date,
  jogos_fim date,
  divulgacao date,
  CONSTRAINT fk_unidade FOREIGN KEY(unidade_id) REFERENCES unidades(id)
  ON DELETE CASCADE
);

CREATE TYPE status AS ENUM('planejado', 'andamento', 'cancelado', 'executado');

ALTER TABLE campeonatos
ADD COLUMN status status;

CREATE TABLE times (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  nome varchar NOT NULL,
  campeonato_id int,
  CONSTRAINT fk_campeonato FOREIGN KEY(campeonato_id) REFERENCES campeonatos(id)
  ON DELETE CASCADE
);

CREATE TABLE inscritos (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  nome varchar NOT NULL,
  whatsapp varchar,
  apelido varchar, 
  data_nascimento date,
  time_id int,
  CONSTRAINT fk_time FOREIGN KEY(time_id) REFERENCES times(id)
);

CREATE TABLE jogos (
  id int GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  time1_id int,
  time2_id int,
  rodada int,
  data_jogo date,
  horario_jogo time,
  quadra_id int,
  CONSTRAINT fk_time1 FOREIGN KEY(time1_id) REFERENCES times(id),
  CONSTRAINT fk_time2 FOREIGN KEY(time2_id) REFERENCES times(id),  
  CONSTRAINT fk_quadra FOREIGN KEY(quadra_id) REFERENCES quadras(id)
);

ALTER TABLE jogos
ADD time1_placar integer;

ALTER TABLE jogos
ADD time2_placar integer;

ALTER TABLE times
ADD vencedores int;

ALTER TABLE inscritos
ADD COLUMN campeonato_id int NOT NULL DEFAULT 2;

ALTER TABLE inscritos
ADD CONSTRAINT campeonato_id FOREIGN KEY (campeonato_id) REFERENCES campeonatos(id);


  
INSERT INTO unidades (nome, endereco, numero, complemento, cep, cidade, estado)
	VALUES ('Caxingui', 'Av. Prestes Maia','20','','9913000','Caxingui','São Paulo'),
  			 ('Barueri', 'Av. Paulista','1300','','13489500','Barueri','São Paulo');

INSERT INTO quadras (nome, unidade_id)
	VALUES('A', 1),
  			('B', 1),
  			('C', 1),
    		('D', 1),
  			('Azul', 2),
  			('Verde', 2);