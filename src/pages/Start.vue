<template>
  <md-app md-waterfall md-mode="fixed">
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">DigiTEK</span>
    </md-app-toolbar>
    <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span>modelInputs</span>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button md-dense" @click="toggleMenu">
            <md-icon>keyboard_arrow_left</md-icon>
          </md-button>
        </div>
      </md-toolbar>
      <md-list>
        <md-list-item>
          <md-field>
            <label for="selectedModel">selectedModel</label>
            <md-select v-model="selectedModelName" name="selectedModelName" id="selectedModelName">
              <md-option :value="model.modelName" :key="model.modelName" v-for="model in models">{{ model.modelName }}</md-option>
            </md-select>
          </md-field>
        </md-list-item>
      </md-list>

      <md-divider></md-divider>

      <md-list v-if="selectedModel && selectedModel.modelInputs">
        <md-list-item v-for="(modelInputType, modelInputKey) in selectedModel.modelInputs" :key="modelInputKey">
          <div v-if="modelInputType === 'boolean'">
            <p class="md-caption">{{ modelInputKey }}</p>
            <md-radio v-model="selectedInputValues[modelInputKey]" :value="true">Ja</md-radio>
            <md-radio v-model="selectedInputValues[modelInputKey]" :value="false">Nei</md-radio>
            <md-radio v-model="selectedInputValues[modelInputKey]" :value="null">Ikke valgt</md-radio>
          </div>
          <md-field v-else>
            <label for="modelInputKey">{{ modelInputKey }}</label>
            <md-input v-model="selectedInputValues[modelInputKey]" :type="translateInputType(modelInputType)" :id="modelInputKey" :name="modelInputKey" />
          </md-field>
        </md-list-item>
      </md-list>

    </md-app-drawer>
    <md-app-content>
      <main class='container'>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="movies">Movies</label>
              <md-select v-model="visibleModelOutputFields" name="visibleModelOutputFields" id="visibleModelOutputFields" md-dense multiple>
                <md-option :value="modelOutputField" v-for="modelOutputField in modelOutputFields" :key="modelOutputField">{{ modelOutputField }}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <form novalidate class="md-layout" v-if="fields && fields.length">
          <md-table v-model="fields" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort" md-card>
            <md-table-toolbar>
              <h1 class="md-title"></h1>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell :md-label="modelOutputField" :md-sort-by="modelOutputField" v-for="modelOutputField in visibleModelOutputFields" :key="modelOutputField">{{ item[modelOutputField] }}</md-table-cell>
            </md-table-row>
          </md-table>
        </form>
      </main>
    </md-app-content>
  </md-app>
</template>

<style lang="scss" src="./Start.scss"></style>
<script src="./Start"></script>
