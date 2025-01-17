import BurnNFT from '@/components/msg/nft/burn_nft';
import MsgBurnNFT from '@/models/msg/nft/msg_burn_nft';
import { MockTheme } from '@/tests/utils';
import renderer from 'react-test-renderer';

// ==================================
// mocks
// ==================================

jest.mock('@/components/name', () => (props: JSX.IntrinsicElements['div']) => (
  <div id="Name" {...props} />
));

// ==================================
// unit tests
// ==================================
describe('screen: TransactionDetails/BurnNFT', () => {
  it('matches snapshot', () => {
    const message: MsgBurnNFT = {
      category: 'nft',
      type: 'MsgBurnNFT',
      sender: 'desmosvaloper14nfk5gm99gfrd7nwqtmtvzunzclz8720a6cqh7',
      id: 'goodGoodDayDay',
      json: {},
    };
    const component = renderer.create(
      <MockTheme>
        <BurnNFT message={message} />
      </MockTheme>
    );
    const tree = component?.toJSON();
    expect(tree).toMatchSnapshot();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
