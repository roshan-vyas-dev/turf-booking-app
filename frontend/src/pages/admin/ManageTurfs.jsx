import { useState, useEffect } from "react";
import api from "../../api/axios";

function ManageTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTurf, setEditingTurf] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    pricePerHour: "",
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTurf, setNewTurf] = useState({
    name: "",
    location: "",
    pricePerHour: "",
    images: "",
    availableSlots: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [newSlot, setNewSlot] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    api
      .get("/api/turfs")
      .then((response) => {
        setTurfs(response.data.turfs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load turfs. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this turf?",
    );

    if (!confirmed) return;
    try {
      await api.delete(`/api/turfs/${id}`);

      const response = await api.get("/api/turfs");
      setTurfs(response.data.turfs);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (turf) => {
    setEditingTurf(turf);

    setEditForm({
      name: turf.name,
      location: turf.location,
      pricePerHour: turf.pricePerHour,
    });
  };

  const handleUpdate = async () => {
    try {
      setError("");
      const formData = new FormData();

      formData.append("name", editForm.name);
      formData.append("location", editForm.location);
      formData.append("pricePerHour", Number(editForm.pricePerHour));

      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await api.patch(
        `/api/turfs/${editingTurf._id}`,
        formData,
      );

      setTurfs((prevTurfs) =>
        prevTurfs.map((turf) =>
          turf._id === editingTurf._id ? response.data.turf : turf,
        ),
      );

      setEditingTurf(null);
      setImagesToDelete([]);
      setSelectedImages([]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update turf");
    }
  };

  const handleCreateTurf = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", newTurf.name);
    formData.append("location", newTurf.location);
    formData.append("pricePerHour", newTurf.pricePerHour);
    formData.append("availableSlots", JSON.stringify(newTurf.availableSlots));

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await api.post("/api/turfs", formData);

      const response = await api.get("/api/turfs");
      setTurfs(response.data.turfs);

      setNewTurf({
        name: "",
        location: "",
        pricePerHour: "",
        images: "",
        availableSlots: [],
      });

      setSelectedImages([]);
      setShowCreateForm(false);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create turf");
    }
  };

  const handleAddSlot = () => {
    if (!newSlot.start || !newSlot.end) {
      setError("Please select both start and end times");
      return;
    }

    if (newSlot.start >= newSlot.end) {
      setError("End time must be later than start time");
      return;
    }

    setNewTurf({
      ...newTurf,
      availableSlots: [...newTurf.availableSlots, newSlot],
    });

    setNewSlot({ start: "", end: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Manage Turfs</h1>

      {/* add turf */}

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="mb-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        {showCreateForm ? "Close Form" : "Add New Turf"}
      </button>

      {showCreateForm && (
        <form
          onSubmit={handleCreateTurf}
          className="mb-8 max-w-xl space-y-4 rounded-xl bg-white p-6 shadow"
        >
          <input
            type="text"
            placeholder="Turf name"
            value={newTurf.name}
            onChange={(e) => setNewTurf({ ...newTurf, name: e.target.value })}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="Location"
            value={newTurf.location}
            onChange={(e) =>
              setNewTurf({ ...newTurf, location: e.target.value })
            }
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            placeholder="Price per hour"
            value={newTurf.pricePerHour}
            onChange={(e) =>
              setNewTurf({ ...newTurf, pricePerHour: e.target.value })
            }
            className="w-full rounded-lg border p-3"
          />

          <div>
            <label className="mb-2 block font-medium">
              Turf Images (Optional)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);

                if (files.length > 5) {
                  setError("You can upload a maximum of 5 images");
                  setSelectedImages([]);
                  return;
                }

                setSelectedImages(files);
                setError("");
              }}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Available Time Slots</h3>

            <div className="flex gap-3">
              <input
                type="time"
                value={newSlot.start}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, start: e.target.value })
                }
                className="w-full rounded-lg border p-3"
              />

              <input
                type="time"
                value={newSlot.end}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, end: e.target.value })
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Add Slot
            </button>

            {newTurf.availableSlots.map((slot, index) => (
              <p key={index} className="text-sm text-gray-700">
                {slot.start} - {slot.end}
              </p>
            ))}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            Create Turf
          </button>
        </form>
      )}

      {/* turf edit and delete */}

      {loading ? <p>Loading turfs...</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading &&  (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => (
            <div key={turf._id} className="rounded-xl bg-white p-5 shadow">
              <div className="mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                {turf.images?.length > 0 && (
                  <img
                    src={turf.images[0].url}
                    alt={turf.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h2 className="text-xl font-bold">{turf.name}</h2>
              <p>{turf.location}</p>
              <p>₹{turf.pricePerHour} / hour</p>

              <button
                onClick={() => handleDelete(turf._id)}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={() => handleEdit(turf)}
                className="mt-4 ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              {editingTurf?._id === turf._id && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {editingTurf.images
                      ?.filter(
                        (image) => !imagesToDelete.includes(image.publicId),
                      )
                      .map((image, index) => (
                        <div key={image} className="relative">
                          <img
                            src={image.url}
                            alt={`Turf ${index + 1}`}
                            className="h-24 w-full rounded-lg object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setImagesToDelete([
                                ...imagesToDelete,
                                image.publicId,
                              ])
                            }
                            className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                  </div>

                  <div>
                    <label className="mb-2 block font-medium">
                      Add More Images (Optional)
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setSelectedImages(files);
                      }}
                      className="w-full rounded-lg border p-3"
                    />
                  </div>

                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Turf name"
                    className="w-full rounded-lg border p-2"
                  />

                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    placeholder="Location"
                    className="w-full rounded-lg border p-2"
                  />

                  <input
                    type="number"
                    value={editForm.pricePerHour}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pricePerHour: e.target.value })
                    }
                    placeholder="Price per hour"
                    className="w-full rounded-lg border p-2"
                  />

                  <button type="button"
                    onClick={handleUpdate}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button type="button"
                    onClick={() => {
                      setEditingTurf(null);
                      setImagesToDelete([]);
                      setSelectedImages([]);
                    }}
                    className="ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageTurfs;
