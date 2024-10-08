document.addEventListener('DOMContentLoaded', () => {
  // Enable editing for a specific row
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      toggleEditMode(id, true);
    });
  });

  // Save changes for a specific row
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      saveChanges(id);
    });
  });

  // Cancel editing for a specific row
  document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      cancelChanges(id);
    });
  });

  // Delete confirmation
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (confirm('Are you sure you want to delete this item?')) {
        deleteItem(id);
      }
    });
  });
});

let originalValues = {};

function toggleEditMode(id, isEditing) {
  const row = document.getElementById(`row-${id}`);
  const editButton = row.querySelector('.edit-btn');
  const saveButton = row.querySelector('.save-btn');
  const cancelButton = row.querySelector('.cancel-btn');
  const fileInput = row.querySelector('.edit-image');
  const imgElement = row.querySelector('img');
  const deleteButton = row.querySelector('.delete-btn');

  if (isEditing) {
    originalValues[id] = {};
    row.querySelectorAll('.editable').forEach(td => {
      const field = td.dataset.field;
      originalValues[id][field] = td.textContent;
    });

    imgElement.style.display = 'none';
    deleteButton.style.display = 'none';
  } else {
    imgElement.style.display = 'block';
    deleteButton.style.display = 'block';
  }

  row.querySelectorAll('.editable').forEach(td => {
    const field = td.dataset.field;
    if (isEditing) {
      const value = td.textContent;
      let inputType = 'text';
      if (field === 'price' || field === 'quantity') {
        inputType = 'number';
      }
      td.innerHTML = `<input type="${inputType}" value="${value}" data-field="${field}" />`;
    } else {
      const input = td.querySelector('input');
      if (input) {
        td.textContent = input.value;
      }
    }
  });

  editButton.style.display = isEditing ? 'none' : 'inline-block';
  saveButton.style.display = isEditing ? 'inline-block' : 'none';
  cancelButton.style.display = isEditing ? 'inline-block' : 'none';
  fileInput.style.display = isEditing ? 'block' : 'none';
}

function cancelChanges(id) {
  const row = document.getElementById(`row-${id}`);

  row.querySelectorAll('.editable').forEach(td => {
    const field = td.dataset.field;
    td.textContent = originalValues[id][field];
  });

  toggleEditMode(id, false);
}

async function saveChanges(id) {
  const row = document.getElementById(`row-${id}`);
  const formData = new FormData();

  let isValid = true;

  row.querySelectorAll('.editable').forEach(td => {
    const input = td.querySelector('input');
    if (input) {
      const field = input.dataset.field;
      const value = input.value;

      // Basic validation
      if (field === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
        alert('Product name should only contain letters and spaces.');
        isValid = false;
      } else if ((field === 'price' || field === 'quantity') && isNaN(value)) {
        alert(`Please enter a valid number for ${field}.`);
        isValid = false;
      } else {
        formData.append(field, value);
      }
    }
  });

  if (!isValid) return;

  const fileInput = row.querySelector('.edit-image');
  if (fileInput.files.length > 0) {
    formData.append('image', fileInput.files[0]);
  }

  try {
    const response = await fetch(`/edit/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      row.querySelectorAll('.editable').forEach(td => {
        const input = td.querySelector('input');
        if (input) {
          td.textContent = input.value;
        }
      });

      const imgElement = document.getElementById(`img-${id}`);
      imgElement.src = result.imageUrl || imgElement.src;

      toggleEditMode(id, false);
    } else {
      alert('Failed to save changes');
    }
  } catch (error) {
    console.error(error);
    alert('Error saving changes');
  }
}

async function deleteItem(id) {
  try {
    const response = await fetch(`/delete/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.getElementById(`row-${id}`).remove();
    } else {
      alert('Failed to delete item');
    }
  } catch (error) {
    console.error(error);
    alert('Error deleting item');
  }
}
