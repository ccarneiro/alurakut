import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import {
  ProfileRelations,
  ProfileRelationsBoxWrapper,
} from '../src/components/ProfileRelations';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AluraCommons';

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home() {
  const githubUser = 'ccarneiro';
  const [followers, setFollowers] = useState([]);
  const [communities, setCommunities] = useState([
    {
      id: new Date().toISOString(),
      title: 'Eu odeio acordar cedo',
      image:
        'https://img10.orkut.br.com/community/52cc4290facd7fa700b897d8a1dc80aa.jpg',
      url: '#',
    },
  ]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];

  useEffect(() => {
    fetchFollowers();
  }, []);

  async function fetchFollowers() {
    const response = await fetch(
      `https://api.github.com/users/${githubUser}/followers`
    ).then((res) => res.json());
    setFollowers(
      response.map((user) => ({
        id: user.login,
        title: user.login,
        image: user.avatar_url,
        url: user.url,
      }))
    );
  }

  function handleCriaComunidade(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const community = {
      id: new Date().toISOString(),
      title: formData.get('title'),
      image:
        formData.get('image') ||
        `https://picsum.photos/200/300?${new Date().getTime()}`,
      url: '#',
    };
    setCommunities([...communities, community]);
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet confiavel={3} legal={3} sexy={3} />
          </Box>
          <Box>
            <h2 className="subTitle">O que vc deseja fazer?</h2>
            <form onSubmit={handleCriaComunidade}>
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Coloque uma url para utilizarmos de capa"
                  name="image"
                  aria-label="Coloque uma url para utilizarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <Box>
            <ProfileRelations title="Seguindo" relations={followers} />
          </Box>
          <Box>
            <ProfileRelations title="Comunidades" relations={communities} />
          </Box>
        </div>
      </MainGrid>
    </>
  );
}
