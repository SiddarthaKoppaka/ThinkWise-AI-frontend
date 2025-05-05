import client from './axiosInstance'


// Fetch all ideas
export const fetchAllIdeas = async () => {
  const { data } = await client.get('/ideas/')
  return data.all_ideas   // <-- return the actual array
}

// Fetch overall top
export const fetchOverallTop = async () => {
  const { data } = await client.get('/ideas/overall_top')
  return data.top_3_ideas  // <-- array
}

export const fetchTopByFile = async filename => {
  const { data } = await client.get('/ideas/top', { params: { filename } })
  return data.top_3_ideas  // <-- array
}

// Analytics dashboard data
export const fetchAnalytics = async () => {
  const { data } = await client.get('/ideas/analytics')
  return data
}

// Chat with idea
export const chatWithIdea = async ({ id, message }) => {
  const { data } = await client.post(
    `/chat/idea/${id}`,
    null,
    { params: { message } }
  );

  const raw = data.response;
  let replyText;

  if (typeof raw === 'string') {
    // direct string
    replyText = raw;
  } else if (raw.response && typeof raw.response === 'string') {
    // nested under `.response`
    replyText = raw.response;
  } else if (raw.text && typeof raw.text === 'string') {
    // nested under `.text`
    replyText = raw.text;
  } else {
    // fallback to JSON
    replyText = JSON.stringify(raw);
  }

  return { reply: replyText };
};


export const fetchIdeaById = async (id) => {
  const { data } = await client.get(`/ideas/${id}`)
  return data.idea
}



export async function lookupIdeaByIdAndFilename(ideaId, filename) {
  const res = await client.get('/ideas/lookup', {
    params: { idea_id: ideaId, filename }
  })
  return res.data // contains { status, idea: { _id, ... } }
}
