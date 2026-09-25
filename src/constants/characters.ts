import { Character } from '@/types';

/** R12: у заглушек все настроения персонажа ведут на один и тот же SVG */
const portraitsOf = (asset: string): Record<Character.Mood, string> => ({
  [Character.Mood.Neutral]: asset,
  [Character.Mood.Happy]: asset,
  [Character.Mood.Worried]: asset,
  [Character.Mood.Angry]: asset,
  [Character.Mood.Scared]: asset,
});

/** Персонажи сценариев: автор (реплики без портрета), наставники, пассажиры */
export const CHARACTERS: Record<Character.Id, Character.Definition> = {
  author: {
    id: 'author',
    name: 'Автор',
    role: Character.Role.Author,
    description:
      'Голос рассказчика: нейтральный, короткие фразы, поясняет контекст ситуации, не даёт оценок.',
  },
  'mentor-anna': {
    id: 'mentor-anna',
    name: 'Анна Викторовна',
    role: Character.Role.Mentor,
    description:
      'Опытный наставник-проводник, говорит спокойно и по делу, объясняет пошагово, использует профессиональные термины ВСМ.',
    portraits: portraitsOf('/characters/mentor-anna.svg'),
  },
  'mentor-igor': {
    id: 'mentor-igor',
    name: 'Игорь Петрович',
    role: Character.Role.Mentor,
    description:
      'Наставник со стажем работы в депо, говорит прямолинейно и требовательно, ценит краткость и дисциплину, иногда подшучивает.',
    portraits: portraitsOf('/characters/mentor-igor.svg'),
  },
  'passenger-oleg': {
    id: 'passenger-oleg',
    name: 'Олег',
    role: Character.Role.Passenger,
    description:
      'Тревожный пассажир, легко паникует и повышает голос в нестандартной ситуации, часто перебивает.',
    portraits: portraitsOf('/characters/passenger-oleg.svg'),
  },
  'passenger-marina': {
    id: 'passenger-marina',
    name: 'Марина',
    role: Character.Role.Passenger,
    description:
      'Спокойная и вежливая пассажирка, задаёт уточняющие вопросы, ценит подробные объяснения.',
    portraits: portraitsOf('/characters/passenger-marina.svg'),
  },
  'passenger-viktor': {
    id: 'passenger-viktor',
    name: 'Виктор',
    role: Character.Role.Passenger,
    description:
      'Раздражительный пассажир-командировочный, торопится, недоволен любой задержкой, разговаривает резко и требовательно.',
    portraits: portraitsOf('/characters/passenger-viktor.svg'),
  },
  'passenger-elena': {
    id: 'passenger-elena',
    name: 'Елена',
    role: Character.Role.Passenger,
    description:
      'Пассажирка с ребёнком, отвлекается на него, говорит мягко, но легко теряется в стрессовой ситуации.',
    portraits: portraitsOf('/characters/passenger-elena.svg'),
  },
};
