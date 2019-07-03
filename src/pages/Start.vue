<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <img :src="dibkLogo" />
      <span class="md-title" style="flex: 1"></span>
      <md-button v-on:click="$emit('log-out')">log out</md-button>
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
        <md-list-item v-if="models && models.length">
          <md-field>
            <label for="selectedModel">selectedModel</label>
            <md-select v-model="selectedModelId" name="selectedModelId" id="selectedModelId">
              <md-option :value="model.bpmnId" :key="model.bpmnId" v-for="model in models">{{ model.bpmnName }}</md-option>
            </md-select>
          </md-field>
        </md-list-item>
      </md-list>

      <md-divider></md-divider>

      <md-list v-if="selectedModel && selectedModel.bpmnInputs">
        <md-list-item v-for="(bpmnInputType, bpmnInputKey) in selectedModel.bpmnInputs" :key="bpmnInputKey">
          <div v-if="bpmnInputType === 'Boolean'">
            <p class="md-caption">{{ bpmnInputKey }}</p>
            <md-radio v-model="selectedInputValues[bpmnInputKey]" :value="true" class="md-primary">Ja</md-radio>
            <md-radio v-model="selectedInputValues[bpmnInputKey]" :value="false" class="md-primary">Nei</md-radio>
            <md-radio v-model="selectedInputValues[bpmnInputKey]" :value="null" class="md-primary">Ikke valgt</md-radio>
          </div>
          <md-field v-else-if="bpmnInputType === 'CodeList'">
            <label for="bpmnInputKey">{{ bpmnInputKey }}</label>
            <md-select v-model="selectedInputValues[bpmnInputKey]" :id="bpmnInputKey" :name="bpmnInputKey">
              <md-option :value="model.value" :key="model.key" v-for="model in codeLists[bpmnInputKey]">{{ model.key }}</md-option>
            </md-select>
          </md-field>
          <md-field v-else>
            <label for="bpmnInputKey">{{ bpmnInputKey }}</label>
            <md-input v-model="selectedInputValues[bpmnInputKey]" :type="translateInputType(bpmnInputType)" :id="bpmnInputKey" :name="bpmnInputKey" />
          </md-field>
        </md-list-item>
        <md-button class="md-raised md-primary" v-on:click="handleSubmitInputValuesClick()">Kjør test</md-button>
      </md-list>

    </md-app-drawer>
    <md-app-content>
      <main class='container'>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="visibleModelOutputVariables">Synlige kolonner</label>
              <md-select v-model="visibleModelOutputVariables" name="visibleModelOutputVariables" id="visibleModelOutputVariables" md-dense multiple>
                <md-option :value="modelOutputVariable" v-for="modelOutputVariable in modelOutputVariables" :key="modelOutputVariable">{{ modelOutputVariable }}</md-option>
              </md-select>
            </md-field>
            <md-field md-clearable>
              <md-input placeholder="Search by variable name..." v-model="search" @input="searchOnTable" />
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter" v-if="outputVariables && outputVariables.length">
          <md-table v-model="filteredOutputVariables" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort" md-card>
            <md-table-toolbar>
              <h1 class="md-title"></h1>
            </md-table-toolbar>
            <md-table-empty-state
            md-label="No fields found"
            :md-description="`No fields found for this query. Try a different search term.`">
          </md-table-empty-state>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell
            v-for="modelOutputVariable in visibleModelOutputVariables"
            :md-label="modelOutputVariable"
            :md-sort-by="modelOutputVariable"
            :key="modelOutputVariable">
            {{ item[modelOutputVariable] }}
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </main>
</md-app-content>
</md-app>
</template>

<style lang="scss" src="./Start.scss"></style>
<script src="./Start"></script>
