import { ButtonLink, ButtonVariant } from '@/components/button';
import { MutedText } from '@/components/muted-text';
import { Page, PageActions, PageTitle } from '@/components/page';
import type { BackLink } from '@/utils';

interface NotFoundProps {
  title: string;
  text?: string;
  back: BackLink;
}

/** Страница без сущности из адреса: заголовок, пояснение и кнопка назад */
export const NotFound = ({ title, text, back }: NotFoundProps) => (
  <Page>
    <PageTitle>{title}</PageTitle>
    {text !== undefined && <MutedText>{text}</MutedText>}
    <PageActions>
      <ButtonLink to={back.to} variant={ButtonVariant.Secondary}>
        {back.label}
      </ButtonLink>
    </PageActions>
  </Page>
);
