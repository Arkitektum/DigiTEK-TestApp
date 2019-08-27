<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <img :src="dibkLogo" />
      <span class="md-title" style="flex: 1"></span>
      <md-button v-on:click="$emit('log-out')">
        <i class="material-icons">exit_to_app</i>
        <span>Logg ut</span>
      </md-button>
    </md-app-toolbar>
    <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span>modelInputs</span>
        <div v-if="testResults" class="md-toolbar-section-end">
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
          <md-autocomplete
            v-else-if="bpmnInputType === 'CodeList'"
            @md-selected="selectFromCodeList($event.value, bpmnInputKey)"
            @md-closed="closeAutocomplete(selectedInputValues[bpmnInputKey], bpmnInputKey)"
            v-model="autoCompleteInputvalues[bpmnInputKey]"
            :value="selectedInputValues[bpmnInputKey]"
            :id="bpmnInputKey"
            :name="bpmnInputKey"
            :md-options="codeLists[bpmnInputKey].map(listItem => ({
              'key': listItem.key,
              'value': listItem.value,
              'toLowerCase': () => listItem.key.toLowerCase(),
              'toString': () => listItem.key
              }))"
            :md-fuzzy-search="false">
            <label :for="bpmnInputKey">{{ bpmnInputKey }}</label>
            <template slot="md-autocomplete-item" slot-scope="{ item, term }">
              <md-highlight-text :md-term="term">{{ item.key }}</md-highlight-text>
            </template>
            <template slot="md-autocomplete-empty" slot-scope="{ term }">
              Ingen treff for "{{ term }}" i {{ bpmnInputKey }}
            </template>
          </md-autocomplete>
          <md-field v-else>
            <label :for="bpmnInputKey">{{ bpmnInputKey }}</label>
            <md-input v-model="selectedInputValues[bpmnInputKey]" :type="translateInputType(bpmnInputType)" :id="bpmnInputKey" :name="bpmnInputKey" />
          </md-field>
        </md-list-item>
        <md-button class="md-raised md-primary" v-on:click="handleSubmitInputValuesClick()">Kjør test</md-button>
      </md-list>

    </md-app-drawer>
    <md-app-content>
      <main v-if='testResults' class='container'>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="visibleModelOutputVariables">Synlige kolonner</label>
              <md-select v-model="visibleModelOutputVariables" name="visibleModelOutputVariables" id="visibleModelOutputVariables" md-dense multiple>
                <md-option :value="modelOutputVariable" v-for="modelOutputVariable in modelOutputVariables" :key="modelOutputVariable">{{ modelOutputVariable }}</md-option>
              </md-select>
            </md-field>
            <md-field md-clearable>
              <md-input placeholder="Søk i variabler" v-model="search" @input="searchOnTable" />
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter" v-if="outputVariables && outputVariables.length">
          <md-table v-model="filteredOutputVariables" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort" md-card>
            <md-table-toolbar>
              <h1 class="md-title">Testresultat</h1>
              <md-button class="md-primary" v-on:click="handleDownloadAsExcelFileClick()">
                <i class="material-icons">save_alt</i>
                <span>Last ned</span>
              </md-button>
            </md-table-toolbar>
            <md-table-empty-state
            md-label="Ingen felter tilgjengelig"
            :md-description="`Fant ingen felter. Nullstill eller prøv et annet søk.`">
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
  <main v-else>
    <md-empty-state
      md-rounded
      md-icon="arrow_back"
      md-label="Ingen testresultat"
      md-description="Fyll ut feltene til venstre og klikk 'KJØR TEST'">
    </md-empty-state>
  </main>

</md-app-content>
</md-app>
</template>

<style lang="scss" src="./Start.scss"></style>
<script src="./Start"></script>
