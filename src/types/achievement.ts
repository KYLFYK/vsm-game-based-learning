export namespace Achievement {
  export type Id = string;

  /** Достижение из каталога: что это и как его получить */
  export interface Definition {
    id: Id;
    title: string;
    description: string;
    /** Условие получения, показывается в каталоге */
    howTo: string;
    /** Путь к квадратной картинке от корня сайта */
    image: string;
  }

  /** Достижение, полученное сотрудником */
  export interface Earned {
    achievementId: Id;
    earnedAt: number;
  }

  /** Достижение каталога с датой получения; не получено — `null` */
  export interface View extends Definition {
    earnedAt: number | null;
  }
}
