import { SiteClient } from 'datocms-client';

export default async function requisicao(request, response) {
  const TOKEN = process.env.DATOCMS_TOKEN;
  if (request.method === 'POST') {
    console.log(request.body, typeof request.body);

    const client = new SiteClient(TOKEN);
    const record = await client.items.create({
      itemType: '968380', // model ID
      title: request.body.title,
      imageUrl: request.body.url,
      creatorSlug: request.body.creatorSlug,
    });
    response.json({
      id: record.id,
      title: record.title,
      image: record.imageUrl,
      url: `/community/${record.id}`,
      creatorSlug: record.creatorSlug,
    });
    return;
  }

  if (request.method === 'GET') {
    const client = new SiteClient(TOKEN);
    const records = await client.items.all({
      nested: 'true',
      'filter[type]': '968380',
      // 'filter[fields]': 'id,title,imageUrl,creatorSlug',
    });
    response.json(records);
    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!',
  });
}
