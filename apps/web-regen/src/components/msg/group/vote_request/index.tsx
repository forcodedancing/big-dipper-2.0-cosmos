import Name from '@/components/name';
import MsgVoteRequest from '@/models/msg/group/msg_vote_request';
import { useProfileRecoil } from '@/recoil/profiles';
import Typography from '@material-ui/core/Typography';
import Trans from 'next-translate/Trans';
import React from 'react';

const VoteRequest: React.FC<{ message: MsgVoteRequest }> = (props) => {
  const { message } = props;

  const voter = useProfileRecoil(message.voter);
  const voterMoniker = voter ? voter?.name : message.voter;

  return (
    <Typography>
      <Trans
        i18nKey="message_contents:MsgVoteRequest"
        components={[<Name address={message.voter} name={voterMoniker} />]}
      />
    </Typography>
  );
};

export default VoteRequest;
