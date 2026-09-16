Qualtrics.SurveyEngine.addOnReady(function() {

  // Hide Next button — retry until Qualtrics renders it,
  // since it may not exist yet when addOnReady first fires.
  function hideNextButton() {
    var btn = document.getElementById('next-button');
    if (btn) {
      btn.style.display = 'none';
    } else {
      setTimeout(hideNextButton, 100);
    }
  }
  hideNextButton();

  var frame = document.getElementById('llm-chat-frame');

  var model        = "${e://Field/llm_model|js}";
  var assistantId  = "${e://Field/llm_assistant_id|js}";
  var systemPrompt = "${e://Field/llm_system_prompt|js}";
  var condition    = "${e://Field/condition|js}";
  var temperature  = "${e://Field/llm_temperature|js}";

  var config = {
    model:        model,
    assistantId:  assistantId,
    systemPrompt: systemPrompt,
    condition:    condition,
    temperature:  temperature
  };

  function sendConfig() {
    frame.contentWindow.postMessage({ type: 'llm_chat_config', config: config }, '*');
  }

  sendConfig();

  window.addEventListener('message', function(e) {

    if (e.data && e.data.type === 'llm_chat_ready') {
      sendConfig();
    }

    if (e.data && (e.data.type === 'llm_chat_update' || e.data.type === 'llm_chat_finished')) {
      var p = e.data.data;
      Qualtrics.SurveyEngine.setEmbeddedData('chat_conversation_json', JSON.stringify(p.conversation));
      Qualtrics.SurveyEngine.setEmbeddedData('chat_model',             p.metadata.model);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_assistant_id',      p.metadata.assistantId);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_thread_id',         p.metadata.threadId);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_total_turns',       String(p.metadata.totalTurns));
      Qualtrics.SurveyEngine.setEmbeddedData('chat_system_prompt',     p.metadata.systemPrompt);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_timestamp',         p.metadata.timestamp);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_condition',         p.metadata.condition);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_mode',              p.metadata.mode);
      Qualtrics.SurveyEngine.setEmbeddedData('chat_temperature',       String(p.metadata.temperature));
    }

    if (e.data && e.data.type === 'llm_chat_finished') {
      var btn = document.getElementById('next-button');
      if (btn) btn.style.display = '';
      setTimeout(function() {
        Qualtrics.SurveyEngine.navClick(null, 'NEXT');
      }, 400);
    }

  });

});
