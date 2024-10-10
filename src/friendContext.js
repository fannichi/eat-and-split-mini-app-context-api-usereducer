import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

const initialFriends = [
  {
    id: 223344,
    name: 'Alicia',
    image: 'https://i.pravatar.cc/48?u=223344',
    balance: 15,
  },
  {
    id: 556677,
    name: 'John',
    image: 'https://i.pravatar.cc/48?u=556677',
    balance: -30,
  },
  {
    id: 889900,
    name: 'Emma',
    image: 'https://i.pravatar.cc/48?u=889900',
    balance: 5,
  },
  {
    id: 112233,
    name: 'Michael',
    image: 'https://i.pravatar.cc/48?u=112233',
    balance: 50,
  },
  {
    id: 445566,
    name: 'Olivia',
    image: 'https://i.pravatar.cc/48?u=445566',
    balance: 0,
  },
];

const initialState = {
  showAddFriend: false,
  friends: initialFriends,
  selectedFriend: null,
  name: '',
  photo: 'https://i.pravatar.cc/48',
  billValue: '',
  yourPart: '',
  whoPays: 'you',
};

const FriendContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'friend/showAddFriend':
      return { ...state, showAddFriend: action.payload };
    case 'friend/updateFriendsList':
      return { ...state, friends: action.payload };
    case 'friend/selectFriend':
      return { ...state, selectedFriend: action.payload };
    case 'friend/setFriendName':
      return { ...state, name: action.payload };
    case 'friend/setFriendPhoto':
      return { ...state, photo: action.payload };
    case 'friend/setBillValue':
      return { ...state, billValue: action.payload };
    case 'friend/setUserValuePart':
      return { ...state, yourPart: action.payload };
    case 'friend/setWhoPaysBill':
      return { ...state, whoPays: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function FriendProvider({ children }) {
  const [
    {
      showAddFriend,
      friends,
      selectedFriend,
      name,
      photo,
      billValue,
      yourPart,
      whoPays,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Handlers

  function handleOpenAddForm() {
    dispatch({ type: 'friend/showAddFriend', payload: !showAddFriend });
    showAddFriend && dispatch({ type: 'friend/selectFriend', payload: null });
  }

  function handleFormAddFriend(newFriend) {
    dispatch({
      type: 'friend/updateFriendsList',
      payload: [...friends, newFriend],
    });
    dispatch({ type: 'friend/showAddFriend', payload: false });
  }

  function handleSelectFriend(curFriend) {
    dispatch({
      type: 'friend/selectFriend',
      payload: selectedFriend?.id === curFriend.id ? null : curFriend,
    });
    dispatch({ type: 'friend/showAddFriend', payload: false });
  }

  function handleSubmitAddFriend(e) {
    const id = crypto.randomUUID();
    e.preventDefault();
    const newFriend = {
      id,
      name,
      image: `${photo.trim()}?u=${id.split('-').at(0)}`,
      balance: 0,
    };
    handleFormAddFriend(newFriend);
  }

  function handleSplitBill(e) {
    e.preventDefault();
    const balance =
      whoPays === 'you' ? Number(billValue) - Number(yourPart) : -yourPart;
    dispatch({
      type: 'friend/updateFriendsList',
      payload: friends.map(friend =>
        selectedFriend?.id === friend.id
          ? { ...friend, balance: friend.balance + balance }
          : friend
      ),
    });
  }

  function handleSetFriendName(e) {
    dispatch({
      type: 'friend/setFriendName',
      payload: e.target.value,
    });
  }
  function handleSetFriendPhoto(e) {
    dispatch({
      type: 'friend/setFriendPhoto',
      payload: e.target.value,
    });
  }

  function handleSetBillValue(e) {
    dispatch({ type: 'friend/setBillValue', payload: e.target.value });
  }

  function handleReflectUserValuePart(e) {
    dispatch({ type: 'friend/setUserValuePart', payload: e.target.value });
  }

  function handleSetWhoPays(e) {
    dispatch({ type: 'friend/setWhoPaysBill', payload: e.target.value });
  }

  useEffect(
    function () {
      dispatch({ type: 'friend/setBillValue', payload: '' });
      dispatch({ type: 'friend/setUserValuePart', payload: '' });
      dispatch({ type: 'friend/setWhoPaysBill', payload: 'you' });
    },
    [selectedFriend]
  );

  return (
    <FriendContext.Provider
      value={{
        selectedFriend,
        name,
        photo,
        billValue,
        handleSetBillValue,
        yourPart,
        handleReflectUserValuePart,
        whoPays,
        handleSetWhoPays,
        handleOpenAddForm,
        handleFormAddFriend,
        handleSelectFriend,
        handleSubmitAddFriend,
        handleSplitBill,
        friends,
        showAddFriend,
        handleSetFriendName,
        handleSetFriendPhoto,
        dispatch,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
}

function useFriend() {
  const context = useContext(FriendContext);

  if (context === undefined) {
    throw new Error('useFriend must be used within a FriendProvider');
  }
  return context;
}

export { FriendProvider, useFriend };
