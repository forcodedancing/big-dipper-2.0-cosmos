export const columns: {
  key: string;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  width: number;
}[] = [
  {
    key: 'validator',
    width: 25,
  },
  {
    key: 'amount',
    width: 25,
    align: 'right',
  },
  {
    key: 'reward',
    width: 25,
    align: 'right',
  },
];
