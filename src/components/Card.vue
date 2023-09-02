<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <li>
        <div class="card-item" @click="openModal = true">
            <div v-if="imageURL" class="card-image-preview" @error="handleImageError" :style="{ backgroundImage: `url(${imageURL})` }"></div>
            <h4>
                <slot> </slot>
            </h4>
        </div>
        <div class="delete-card-btn-container">
            <button @click="deleteCard" class="delete-card-btn">
                <v-icon icon="mdi-archive" size="x-small"></v-icon>
            </button>
        </div>
        <!--Modal Window -->
        <v-dialog v-model="openModal" max-width="500">
            <v-card>
                <v-img
                    v-if="imageURL"
                    :src="imageURL"
                    height="200"
                    cover
                    @error="handleImageError"
                ></v-img>
                <v-card-title class="modal-title">
                    <span class="headline">Edit Card</span>
                    <input id="fileUpload" type="file" hidden @change="uploadImage">
                    <v-tooltip top light location="top">
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-paperclip" @click="openFileManager" variant="plain"></v-btn> 
                        </template>
                        <span>Attach File</span>
                    </v-tooltip>  
                </v-card-title>
                <v-card-text class="card-title">
                    <v-text-field label="Title" v-model="newTitle">
                    </v-text-field>
                    <v-textarea label="Description" v-model="newDescription">
                    </v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="tonal" @click="openModal = false">Close</v-btn>
                    <v-btn color="primary" variant="tonal" @click="saveCard">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </li>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { createToast } from 'mosha-vue-toastify';
// import DefaultImage from '../../public/default.jpg';
import 'mosha-vue-toastify/dist/style.css';

export default {
    data() {
        return {
            openModal: false,
            newTitle: this.card.cardTitle,
            newDescription: this.card.cardDescription,
            imageURL: null,
        };
    },
    props: {
        card: {
            type: Object,
            required: true,
        },
        column: {
            type: Object,
            required: true,
        },
    },
    methods: {
        ...mapActions([
            'GET_COLUMNS',
            'GET_CARDS_BY_COLUMN_ID',
            'ADD_COLUMN',
            'ADD_CARD',
            'DELETE_CARD',
            'UPDATE_CARD',
            'UPLOAD_IMAGE',
            'SET_IMAGE',
            'UPDATE_CARD_IMAGE',
            'DELETE_CARD_IMAGE',
        ]),
        ...mapMutations(['SET_LOADING']),

        toast() {
            createToast(
                { title: 'Title cannot be empty' },
                { timeout: 3500, position: 'top-right', showIcon: true },
            );
        },

        handleImageError() {
            this.imageURL = '/default.jpg'; 
        },

        openFileManager() {
            document.getElementById('fileUpload').click();
        },

        // загрузить картинку на s3 бакет
        async uploadImage(event) {
            try {
                this.SET_LOADING(true);
                const selectedFile = event.target.files[0];
                if (selectedFile) {
                    await this.UPLOAD_IMAGE({
                        cardID: this.card.cardID, 
                        file: selectedFile,
                    });
                    await this.setImage(this.card.cardID);
                    await this.UPDATE_CARD_IMAGE({
                        cardID: this.card.cardID, 
                    });
                }
            } catch(error) {
                console.log('Error uploading an image', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        // получить url картинки и установить его для карточки
        async setImage(cardID) {
            this.SET_LOADING(true);

            try {
                const imageURL = await this.SET_IMAGE(cardID);
                this.imageURL = imageURL;
            }
            catch(error) {
                console.log('Error getting an image', error);
            }
            finally {
                this.SET_LOADING(false);
            }
        },

        async deleteCard() {
            try {
                this.SET_LOADING(true);
                await this.deleteCardImage(this.card.cardID);
                await this.DELETE_CARD(this.card.cardID);
            } catch (error) {
                console.error('Error deleting a card:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },

        async deleteCardImage(cardID) {
            await this.DELETE_CARD_IMAGE(cardID);
        },

        async saveCard() {
            try {
                this.openModal = false;

                this.newTitle = this.newTitle.trim();

                //не отправляем запрос, если:

                //имя колонки пустая строка
                if (this.newTitle.length === 0) {
                    this.newTitle = this.card.cardTitle;
                    this.toast();
                    return;
                }
                //имя колонки не поменялось
                if(this.newTitle === this.card.cardTitle && !this.newDescription) {
                    this.newTitle = this.card.cardTitle;
                    return;
                }

                //имя колонки не поменялось и описание не поменялось
                else if (
                    this.card.cardDescription &&
                    this.newDescription.trim() ===
                    this.card.cardDescription.trim()
                ) {
                    this.newTitle = this.card.cardTitle;
                    this.newDescription = this.card.cardDescription;

                    return;
                }

                this.SET_LOADING(true);
                const updatedCard = {
                    cardID: this.card.cardID,
                    cardTitle: this.newTitle,
                    cardDescription: this.newDescription
                        ? this.newDescription.trim()
                        : ' ',
                };

                await this.UPDATE_CARD(updatedCard);
            } catch (error) {
                console.error('Error updating a card:', error);
            } finally {
                this.SET_LOADING(false);
            }
        },
    },

    mounted() {
        if (this.card.hasImage) {
            this.SET_LOADING(true);
            this.setImage(this.card.cardID);
        }
        this.SET_LOADING(false);

    },
};
</script>

<style scoped>

.modal-title {
    color:#4a5568;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
}

.card-title {
    color:#4a5568;
    font-weight: 400;
}

.card-image-preview {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 60px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.ghost {
    background: lightgray;
    border-radius: 6px;
    visibility: hidden;
}

h4 {
    padding: 0.3rem;
    color: #4a5568;
}

.card-item {
    font-size: 0.875rem;
}

li {
    position: relative;
    background-color: #fff;
    padding: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    border-bottom-width: 1px;
    border-color: #e2e8f0;
}

li:hover {
    background-color: #f7fafc;
}

.delete-card-btn {
    display: none;
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 2rem;
    height: 2rem;
    background-color: #f7fafc;
    place-content: center;
    border-radius: 0.375rem;
    color: #718096;
}

.delete-card-btn:hover {
    background-color: #edf2f7;
}
li:hover .delete-card-btn {
    display: grid;
}
</style>
