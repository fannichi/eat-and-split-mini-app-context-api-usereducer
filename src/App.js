import { FriendProvider, useFriend } from './friendContext';

function App() {
  return (
    <FriendProvider>
      <FormsContainer />
    </FriendProvider>
  );
}

function FormsContainer() {
  const {
    showAddFriend,
    selectedFriend,
    handleOpenAddForm,
    handleFormAddFriend,
  } = useFriend();

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList />
        {showAddFriend && <FormAddFriend onAddFriend={handleFormAddFriend} />}

        <Button onClick={handleOpenAddForm}>
          {showAddFriend ? 'CLOSE' : 'ADD FRIEND'}
        </Button>
      </div>
      {selectedFriend && <FormSplitBill />}
    </div>
  );
}

function FriendsList() {
  const { friends } = useFriend();
  return (
    <>
      <ul>
        {friends.map(friend => (
          <Friend friend={friend} key={friend.id} />
        ))}
      </ul>
    </>
  );
}
function Friend({ friend }) {
  const { handleSelectFriend, selectedFriend } = useFriend();
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      <p
        className={
          friend.balance > 0 ? 'green' : friend.balance < 0 ? 'red' : ''
        }
      >
        {friend.balance > 0 && `${friend.name} owes you $${friend.balance}`}
        {friend.balance < 0 &&
          `You owe ${friend.name} $${Math.abs(friend.balance)}`}
        {friend.balance === 0 && `You and ${friend.name} are even`}
      </p>
      <Button onClick={() => handleSelectFriend(friend)}>
        {selectedFriend?.id !== friend.id ? 'SELECT' : 'CLOSE'}
      </Button>
    </li>
  );
}

function FormAddFriend() {
  const {
    name,
    photo,
    handleSetFriendName,
    handleSubmitAddFriend,
    handleSetFriendPhoto,
  } = useFriend();

  return (
    <form className="form-add-friend" onSubmit={handleSubmitAddFriend}>
      <span>Name:</span>
      <input type="text" value={name} onChange={handleSetFriendName} />
      <span>Photo:</span>
      <input type="text" value={photo} onChange={handleSetFriendPhoto} />
      <Button>ADD</Button>
    </form>
  );
}
function FormSplitBill() {
  const {
    selectedFriend,
    billValue,
    handleSetBillValue,
    yourPart,
    handleReflectUserValuePart,
    whoPays,
    handleSetWhoPays,
    handleSplitBill,
  } = useFriend();

  const friendPart = billValue - yourPart;

  return (
    <form
      key={selectedFriend.id}
      className="form-split-bill"
      onSubmit={handleSplitBill}
    >
      <h2>Split bill with : {selectedFriend?.name}</h2>

      <span>Bill Value:</span>
      <input type="text" value={billValue} onChange={handleSetBillValue} />

      <span>Your Part:</span>
      <input
        type="text"
        value={yourPart}
        onChange={handleReflectUserValuePart}
      />

      <span>{selectedFriend?.name}'s Part:</span>
      <input
        type="text"
        disabled={true}
        value={billValue !== '' ? friendPart : ''}
      />

      <span>Who is paying the bill:</span>
      <select value={whoPays} onChange={handleSetWhoPays}>
        <option value="you">YOU</option>
        <option value="friend">{selectedFriend?.name}</option>
      </select>

      <Button>SPLIT</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default App;
