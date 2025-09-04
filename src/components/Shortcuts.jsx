function Shortcuts({ shortcuts, setShortcuts, setShortModal, setEditInfo, setEditModal }) {
  function handleEdit(e, i) {
    e.preventDefault();
    setEditInfo(i);
    setEditModal(true);
  }

  function handleDelete(e, i) {
    e.preventDefault();
    let ogShortcuts = [...shortcuts];
    ogShortcuts.splice(i, 1);
    setShortcuts(ogShortcuts);
  }

  return (
    <div className="shortcuts">
      {shortcuts.map((shortcut, i) => {
        return (
          <a href={shortcut.url} className="shortcut">
            <img src={`https://www.google.com/s2/favicons?domain=${shortcut.url}&sz=256`} />
            {shortcut.name}
            <div className="shortcut-icons">
              <img src="/lightning/icons/edit.svg" title="Edit shortcut" onClick={(e) => handleEdit(e, i)} />
              <img src="/lightning/icons/delete.svg" title="Delete shortcut" onClick={(e) => handleDelete(e, i)} />
            </div>
          </a>
        );
      })}
      {shortcuts.length < 10 && (
        <div className="add-shortcut" onClick={() => setShortModal(true)}>
          <img src="/lightning/icons/add.svg" />
          Add Shortcut
        </div>
      )}
    </div>
  );
}

export default Shortcuts;
