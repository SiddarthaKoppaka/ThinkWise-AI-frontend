// utils/fakeIdeas.js
import { faker } from '@faker-js/faker';

export function generateFakeIdeas(count = 50) {
  const categories = ['AI', 'Logistics', 'Healthcare', 'Education', 'Finance', 'Marketing'];
  const effortLevels = ['Low', 'Medium', 'High'];
  const roiLevels = ['Low', 'Medium', 'High'];

  const ideas = Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    title: faker.hacker.phrase(),
    category: faker.helpers.arrayElement(categories),
    author: faker.person.firstName(),
    date: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
    description: faker.lorem.sentences(2),
    roi: faker.helpers.arrayElement(roiLevels),
    effort: faker.helpers.arrayElement(effortLevels),
    score: faker.number.int({ min: 60, max: 100 })
  }));

  return ideas;
}
