import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from '../src/components/Box';
import MainGrid from '../src/components/MainGrid';
import {
  ProfileRelationsBox,
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

export default function Home({ token }) {
  const githubUser = 'ccarneiro';
  const [friends, setFriends] = useState([]);
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
    fetchFriends();
    fetchCommunities();
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

  async function fetchFriends() {
    const myFriends = pessoasFavoritas.map((name) => ({
      id: name,
      title: name,
      image: `https://github.com/${name}.png`,
      url: `https://github.com/${name}`,
    }));
    setFriends(myFriends);
  }

  async function fetchCommunities() {
    /*
    const data = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }

          _allCommunitiesMeta {
            count
          }
        }`,
      }),
    }).then((response) => response.json()); */
    // console.log(data.data.allCommunities);
    const data = await fetch('/api/comunidades').then((response) =>
      response.json()
    );
    const communitiesData = data.map((community) => ({
      id: community.id,
      title: community.title,
      image: community.imageUrl,
      url: `/communities/${community.id}`,
      creatorSlug: community.creatorSlug,
    }));
    setCommunities(communitiesData);
  }

  async function handleCriaComunidade(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const community = {
      title: formData.get('title'),
      image:
        formData.get('image') ||
        `https://picsum.photos/200/300?${new Date().getTime()}`,
      url: '#',
      creatorSlug: githubUser,
    };
    const communitySaved = await fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(community),
    }).then((res) => res.json());
    setCommunities([...communities, communitySaved]);
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
          <ProfileRelationsBox title="Seguindo" items={followers} />
          <ProfileRelationsBox title="Amigos" items={friends} />
          <ProfileRelationsBox title="Comunidades" items={communities} />
        </div>
      </MainGrid>
    </>
  );
}

export async function getStaticProps() {
  return { props: { token: process.env.DATOCMS_TOKEN_READONLY } };
}
