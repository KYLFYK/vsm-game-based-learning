export namespace Character {
  export type Id = string;

  export enum Role {
    Author = 'author',
    Mentor = 'mentor',
    Passenger = 'passenger',
  }

  export enum Mood {
    Neutral = 'neutral',
    Happy = 'happy',
    Worried = 'worried',
    Angry = 'angry',
    Scared = 'scared',
  }

  export enum Side {
    Left = 'left',
    Right = 'right',
  }

  export interface Definition {
    id: Id;
    name: string;
    role: Role;
    description: string; // характер и манера речи для авторов сценариев
    portraits?: Record<Mood, string>; // отсутствует у автора
  }
}
