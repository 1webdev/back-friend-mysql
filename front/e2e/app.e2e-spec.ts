import { TournamentFrontPage } from './app.po';

describe('tournament-front App', () => {
  let page: TournamentFrontPage;

  beforeEach(() => {
    page = new TournamentFrontPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
