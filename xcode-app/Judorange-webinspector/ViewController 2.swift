//
//  ViewController.swift
//  web_dev_browser-v0
//
//  Created by Julien Cuénot on 07/05/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import UIKit
import WebKit


// ==========================================================================

protocol NavBarDelegate {
    //func testDelegate()
    func loadUrlField()
    func loadTab1()
    func loadTab2()
    func loadTab3()
    func loadTab4()
}

protocol WebViewsManagerDelegate {
    //func testDelegate()
    func updateBackForwardBtnStates(webView_id: Int)
    func updateUrlField(webView_id: Int)
    func updateTabName(webView_id: Int)
}

protocol ToolBarDelegate {
    //func testDelegate()
    func goBack()
    func goForward()
    func goReload()
    func showOrHideInspector()
}

// ==========================================================================





class ViewController:UIViewController, WKUIDelegate, WKNavigationDelegate, NavBarDelegate, WebViewsManagerDelegate, ToolBarDelegate {

    
    
    
    
    // ==========================================================================
    // DEAL WITH CHILD VIEW CONTROLLERS
    
    // CHILD CONTAINER VIEW IS HERE
    var navBarController: NavBarController?
    var webViewsManagerController: WebViewsManagerController?
    var toolBarController: ToolBarController?
    
    // ACCESS CONTAINER VIEW CHILD
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
        
        if(segue.identifier == "navbarSegue"){
            navBarController = segue.destination as? NavBarController
            navBarController?.navBarDelegate = self
        }
        
        if(segue.identifier == "webviewManagerSegue"){
            webViewsManagerController = segue.destination as? WebViewsManagerController
            webViewsManagerController?.webViewsManagerDelegate = self as WebViewsManagerDelegate
        }
        
        if(segue.identifier == "toolbarSegue"){
            toolBarController = segue.destination as? ToolBarController
            toolBarController?.toolBarDelegate = self as ToolBarDelegate
        }
        
    }
    
    // RETRIEVE DATA. THANKS TO PROTOCOL AT THE TOP OF THE DOCUMENT
    //func testDelegate(){ print("PARENT") }
    
    // ==========================================================================
    
    
    
    
    
    // TOOLBAR ==========================================================
    
    func goBack() {
        if (self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.canGoBack){ self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.goBack()
        }
    }
    
    func goForward() {
        if (self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.canGoForward){
            self.webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.goForward()
        }
    }
    
    func goReload() { webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("location.reload(true);", completionHandler: nil)
    }
    
    func showOrHideInspector(){ // SHOW OR HIDE INSPECTOR
        if(
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible
            ){
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("eruda.hide();", completionHandler: nil)
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible = false
        }
        else{ webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView.evaluateJavaScript("eruda.show();", completionHandler: nil)
            webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].isInspectorVisible = true
        }
    }
    
    func loadTab1(){
        webViewsManagerController!.setCurrentWebView(index: 0)
        updateUrlField(webView_id: 0)
        updateBackForwardBtnStates(webView_id: 0)
    }
    func loadTab2(){
        webViewsManagerController!.setCurrentWebView(index: 1)
        updateUrlField(webView_id: 1)
        updateBackForwardBtnStates(webView_id: 1)
    }
    func loadTab3(){
        webViewsManagerController!.setCurrentWebView(index: 2)
        updateUrlField(webView_id: 2)
        updateBackForwardBtnStates(webView_id: 2)
    }
    func loadTab4(){
        webViewsManagerController!.setCurrentWebView(index: 3)
        updateUrlField(webView_id: 3)
        updateBackForwardBtnStates(webView_id: 3)
    }
    
    // ==========================================================================
    
    
    
    
    
    // WEBVIEW ==========================================================
    
    func updateBackForwardBtnStates(webView_id: Int) { // Received call from webview
        // WEBVIEW
        let webview = webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView
        // UPDATE BACK
        if (webview.canGoBack){ toolBarController!.backButton.isEnabled = true }
        else{ toolBarController!.backButton.isEnabled = false }
        // UPDATE FORWARD
        if (webview.canGoForward){ toolBarController!.forwardButton.isEnabled = true }
        else{ toolBarController!.forwardButton.isEnabled = false }
        
    }
    
    func updateUrlField(webView_id: Int) {
        let webview = webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].webView
        let str_webview_url = webview.url?.absoluteString ?? "error"
        print(str_webview_url)
        navBarController?.urlField.text = str_webview_url
    }
    
    func updateTabName(webView_id: Int) {
        let title = webViewsManagerController!.webViewControllers[webView_id].webView.title
        if(webView_id == 0){ navBarController?.tab1Btn.setTitle(title, for: .normal) }
        else if(webView_id == 1){ navBarController?.tab2Btn.setTitle(title, for: .normal) }
        else if(webView_id == 2){ navBarController?.tab3Btn.setTitle(title, for: .normal) }
        else if(webView_id == 3){ navBarController?.tab4Btn.setTitle(title, for: .normal) }
    }
    
    func loadUrlField(){
        // LOAD REMOTE URL
        let str_url = navBarController?.urlField.text ?? "https://judorange.ju-dev.fr"
        webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].loadURL(str_url: str_url)
        webViewsManagerController!.webViewControllers[webViewsManagerController!.currentWebWiew].loadJSFiles()
    }
    
    // ==========================================================================
    
    
    
    
    
    override func viewDidLoad() {   // loadView or viewDidLoad
        
        // CALL SUPER
        super.viewDidLoad()         // super.loadView or super.viewDidLoad
        
        // Disable navigation buttons on first loads
        toolBarController!.backButton.isEnabled = false
        toolBarController!.forwardButton.isEnabled = false
        
    }
    
    
    
    
    
    // AUTO HIDE HOME BOTTOM BAR
    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
    
    
    // STATUS BAR WHITE TEXT
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    
    
} // End of class





